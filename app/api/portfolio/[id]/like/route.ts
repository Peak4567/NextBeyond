import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนกดถูกใจ" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  const [existing] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM portfolio_likes WHERE portfolio_id = ? AND user_id = ?",
    [id, user.id]
  );

  let liked: boolean;
  if (existing.length > 0) {
    await pool.query("DELETE FROM portfolio_likes WHERE portfolio_id = ? AND user_id = ?", [id, user.id]);
    await pool.query("UPDATE portfolios SET likes = GREATEST(likes - 1, 0) WHERE id = ?", [id]);
    liked = false;
  } else {
    await pool.query("INSERT INTO portfolio_likes (portfolio_id, user_id) VALUES (?, ?)", [id, user.id]);
    await pool.query("UPDATE portfolios SET likes = likes + 1 WHERE id = ?", [id]);
    liked = true;
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT likes FROM portfolios WHERE id = ?",
    [id]
  );

  return NextResponse.json({ liked, likes: rows[0]?.likes ?? 0 });
}
