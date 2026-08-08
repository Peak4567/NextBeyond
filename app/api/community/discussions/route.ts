import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getCommunityDiscussions } from "@/lib/data";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนตั้งกระทู้" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = body?.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "กรุณากรอกหัวข้อกระทู้" }, { status: 400 });
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO community_discussions (user_id, title, author, replies, time_label, sort_order)
     VALUES (?, ?, ?, 0, 'เมื่อสักครู่', 0)`,
    [user.id, title, user.fullName]
  );

  const discussions = await getCommunityDiscussions();
  return NextResponse.json({ id: result.insertId, discussions });
}
