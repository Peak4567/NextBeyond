import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const fullName = body?.fullName?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร" },
      { status: 400 }
    );
  }

  const [existing] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
    [fullName, email, passwordHash]
  );

  await createSession(result.insertId);

  return NextResponse.json({
    user: { id: result.insertId, fullName, email, role: "member" },
  });
}
