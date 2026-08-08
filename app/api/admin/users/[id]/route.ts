import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const role = body?.role;
  if (role !== "admin" && role !== "member") {
    return NextResponse.json({ error: "ตำแหน่งไม่ถูกต้อง" }, { status: 400 });
  }

  if (id === admin.id && role === "member") {
    return NextResponse.json(
      { error: "ไม่สามารถปลดสิทธิ์แอดมินของตัวเองได้" },
      { status: 400 }
    );
  }

  await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

  return NextResponse.json({ ok: true });
}
