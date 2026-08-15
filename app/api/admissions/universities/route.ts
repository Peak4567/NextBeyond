import { NextResponse } from "next/server";
import { getUniversitiesList } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const universities = await getUniversitiesList();
  return NextResponse.json({ universities });
}
