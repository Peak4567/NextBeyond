import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, title, faculty, university, status, likes, page_count, created_at AS createdAt
     FROM portfolios WHERE user_id = ? ORDER BY created_at DESC`,
    [user.id]
  );

  return NextResponse.json({ portfolios: rows });
}
