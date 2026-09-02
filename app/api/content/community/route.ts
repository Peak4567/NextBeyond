import { NextResponse } from "next/server";
import { getPortfolios, getCommunityDiscussions } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const [portfolios, discussions] = await Promise.all([
    getPortfolios(),
    getCommunityDiscussions(),
  ]);

  return NextResponse.json({ portfolios, discussions });
}
