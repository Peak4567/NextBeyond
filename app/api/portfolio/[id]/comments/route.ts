import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getPortfolioComments } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const content = body?.content?.trim();
  if (!content) {
    return NextResponse.json({ error: "กรุณากรอกข้อความ" }, { status: 400 });
  }

  await pool.query(
    "INSERT INTO portfolio_comments (portfolio_id, user_id, content) VALUES (?, ?, ?)",
    [id, user.id, content]
  );

  const comments = await getPortfolioComments(id);
  return NextResponse.json({ comments });
}
