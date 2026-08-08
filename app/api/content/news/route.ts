import { NextResponse } from "next/server";
import { getNewsArticles, getNewsHotTopics } from "@/lib/data";

export async function GET() {
  const [mainNews, hotTopics] = await Promise.all([
    getNewsArticles(),
    getNewsHotTopics(),
  ]);

  return NextResponse.json({ mainNews, hotTopics });
}
