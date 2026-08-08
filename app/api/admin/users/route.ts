import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, full_name AS fullName, email, role, created_at AS createdAt FROM users ORDER BY id"
  );

  return NextResponse.json({ users: rows });
}
