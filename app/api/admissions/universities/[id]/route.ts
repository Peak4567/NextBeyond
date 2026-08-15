import { NextResponse } from "next/server";
import { getUniversityInfo } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const university = await getUniversityInfo(params.id);
  if (!university) {
    return NextResponse.json({ error: "ไม่พบมหาวิทยาลัยนี้" }, { status: 404 });
  }
  return NextResponse.json({ university });
}
