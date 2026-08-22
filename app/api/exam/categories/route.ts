import { NextResponse } from "next/server";
import { getExamCategories, getExamSetsByCategory } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getExamCategories();
  const withSets = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      sets: await getExamSetsByCategory(cat.id),
    }))
  );
  return NextResponse.json({ categories: withSets });
}
