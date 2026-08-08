import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

interface UserRow extends RowDataPacket {
  id: number;
  full_name: string;
  email: string;
  role: "admin" | "member";
  password_hash: string;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "กรุณากรอกอีเมลและรหัสผ่าน" },
      { status: 400 }
    );
  }

  const [rows] = await pool.query<UserRow[]>(
    "SELECT id, full_name, email, role, password_hash FROM users WHERE email = ?",
    [email]
  );
  const user = rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json(
      { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role },
  });
}
