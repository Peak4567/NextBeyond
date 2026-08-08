import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getSessionUser();
  return user && user.role === "admin" ? user : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: { blockId: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const blockId = Number(params.blockId);
  const body = await request.json().catch(() => null);

  await pool.query(
    "UPDATE news_blocks SET text_content = ?, is_bold = ?, is_italic = ? WHERE id = ? AND block_type = 'text'",
    [String(body?.textContent ?? ""), body?.isBold ? 1 : 0, body?.isItalic ? 1 : 0, blockId]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { blockId: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  await pool.query("DELETE FROM news_blocks WHERE id = ?", [Number(params.blockId)]);

  return NextResponse.json({ ok: true });
}
