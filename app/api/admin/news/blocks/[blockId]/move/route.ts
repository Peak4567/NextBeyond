import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { blockId: string } }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const blockId = Number(params.blockId);
  const body = await request.json().catch(() => null);
  const direction = body?.direction;
  if (direction !== "up" && direction !== "down") {
    return NextResponse.json({ error: "ทิศทางไม่ถูกต้อง" }, { status: 400 });
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, news_article_id, sort_order FROM news_blocks WHERE id = ?",
    [blockId]
  );
  const current = rows[0];
  if (!current) {
    return NextResponse.json({ error: "ไม่พบบล็อกนี้" }, { status: 404 });
  }

  const [neighborRows] = await pool.query<RowDataPacket[]>(
    direction === "up"
      ? "SELECT id, sort_order FROM news_blocks WHERE news_article_id = ? AND sort_order < ? ORDER BY sort_order DESC LIMIT 1"
      : "SELECT id, sort_order FROM news_blocks WHERE news_article_id = ? AND sort_order > ? ORDER BY sort_order ASC LIMIT 1",
    [current.news_article_id, current.sort_order]
  );
  const neighbor = neighborRows[0];
  if (!neighbor) {
    return NextResponse.json({ ok: true });
  }

  await pool.query("UPDATE news_blocks SET sort_order = ? WHERE id = ?", [neighbor.sort_order, current.id]);
  await pool.query("UPDATE news_blocks SET sort_order = ? WHERE id = ?", [current.sort_order, neighbor.id]);

  return NextResponse.json({ ok: true });
}
