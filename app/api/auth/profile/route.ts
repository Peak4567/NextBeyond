import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const fullName = body?.fullName?.trim();
  const email = body?.email?.trim().toLowerCase();

  if (!fullName || !email) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
  }

  const [existing] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ? AND id != ?",
    [email, user.id]
  );
  if (existing.length > 0) {
    return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 });
  }

  await pool.query("UPDATE users SET full_name = ?, email = ? WHERE id = ?", [
    fullName,
    email,
    user.id,
  ]);

  return NextResponse.json({ user: { ...user, fullName, email } });
}
