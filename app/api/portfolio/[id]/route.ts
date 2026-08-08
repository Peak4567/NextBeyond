import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getPortfolioById, getPortfolioImages, getPortfolioComments } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  const portfolio = await getPortfolioById(id);
  if (!portfolio) {
    return NextResponse.json({ error: "ไม่พบเล่มผลงานนี้" }, { status: 404 });
  }

  const [images, comments, user] = await Promise.all([
    getPortfolioImages(id),
    getPortfolioComments(id),
    getSessionUser(),
  ]);

  let likedByMe = false;
  if (user) {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM portfolio_likes WHERE portfolio_id = ? AND user_id = ?",
      [id, user.id]
    );
    likedByMe = rows.length > 0;
  }

  return NextResponse.json({ portfolio, images, comments, likedByMe });
}
