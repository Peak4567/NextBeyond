import { NextResponse } from "next/server";
import { getNewsArticleById, getNewsBlocks } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  const article = await getNewsArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "ไม่พบข่าวนี้" }, { status: 404 });
  }

  const blocks = await getNewsBlocks(id);
  return NextResponse.json({ article, blocks });
}
