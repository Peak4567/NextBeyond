import { NextResponse } from "next/server";
import { getImportantDates, getChecklistItems, getExamBankItems } from "@/lib/data";

export async function GET() {
  const [importantDates, checklistItems, examBank] = await Promise.all([
    getImportantDates(),
    getChecklistItems(),
    getExamBankItems(),
  ]);

  return NextResponse.json({ importantDates, checklistItems, examBank });
}
