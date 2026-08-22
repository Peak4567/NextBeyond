import { NextResponse } from "next/server";
import { getAutoUpdatedNews } from "@/lib/googleNews";

export const dynamic = "force-dynamic";

export async function GET() {
  const { items, fetchedAt } = await getAutoUpdatedNews(6);
  return NextResponse.json({ items, fetchedAt });
}
