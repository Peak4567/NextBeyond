import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getSessionUser();
  return user && user.role === "admin" ? user : null;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, block_type, text_content, image_path, is_bold, is_italic, sort_order FROM news_blocks WHERE news_article_id = ? ORDER BY sort_order, id",
    [Number(params.id)]
  );

  return NextResponse.json({ blocks: rows });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const articleId = Number(params.id);
  const body = await request.json().catch(() => null);
  const blockType = body?.blockType;

  if (blockType !== "text" && blockType !== "image") {
    return NextResponse.json({ error: "ประเภทบล็อกไม่ถูกต้อง" }, { status: 400 });
  }

  const [maxRows] = await pool.query<RowDataPacket[]>(
    "SELECT COALESCE(MAX(sort_order), -1) + 1 AS nextOrder FROM news_blocks WHERE news_article_id = ?",
    [articleId]
  );
  const nextOrder = maxRows[0].nextOrder;

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO news_blocks (news_article_id, block_type, text_content, image_path, is_bold, is_italic, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      articleId,
      blockType,
      blockType === "text" ? String(body?.textContent ?? "") : null,
      blockType === "image" ? String(body?.imagePath ?? "") : null,
      body?.isBold ? 1 : 0,
      body?.isItalic ? 1 : 0,
      nextOrder,
    ]
  );

  return NextResponse.json({ id: result.insertId });
}
