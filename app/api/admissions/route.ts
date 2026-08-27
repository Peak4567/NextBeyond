import { NextResponse } from "next/server";
import { getAdmissionCriteria, getRandomPdfShowcase } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/**
 * เกณฑ์การรับสมัครซิงค์มาจากชุดข้อมูลสาธารณะของ mytcas.com (TCAS70) จริง
 * ผ่านระบบหลังบ้าน — ค้นหา/กรองที่นี่เพื่อไม่ต้องส่งข้อมูลทั้งหมดในครั้งเดียว
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || undefined;
  const round = searchParams.get("round")?.trim() || undefined;
  const universityId = searchParams.get("universityId")?.trim() || undefined;
  const pdfStatusRaw = searchParams.get("pdfStatus")?.trim();
  const pdfStatus = pdfStatusRaw === "has" || pdfStatusRaw === "none" ? pdfStatusRaw : undefined;
  const showcase = searchParams.get("showcase") === "1";
  const requestedLimit = Number(searchParams.get("limit"));
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 3000)
    : 50;

  const [{ items, total }, settings] = await Promise.all([
    showcase ? getRandomPdfShowcase(10, 3) : getAdmissionCriteria({ q, round, universityId, pdfStatus, limit }),
    getSettings(),
  ]);

  const criteria = items.map((item) => ({
    ...item,
    scoreBreakdown: item.scoreBreakdown
      ? (JSON.parse(item.scoreBreakdown) as { key: string; label: string; weight: number }[])
      : [],
    details: item.detailsJson
      ? (JSON.parse(item.detailsJson) as {
          description: string | null;
          condition: string | null;
          openDateShort: string | null;
          openDateNote: string | null;
          closedDate: string | null;
          interviewDate: string | null;
          interviewTime: string | null;
          interviewLocation: string | null;
          minGpaBreakdown: { label: string; value: string }[];
          physicalRequirements: { label: string; value: string }[];
        })
      : null,
    isCustomPortal: Boolean(item.sourceIsCustom),
  }));

  return NextResponse.json({
    criteria,
    total,
    source: {
      name: "TCAS70 (mytcas.com)",
      url: "https://course.mytcas.com",
      syncedAt: settings.admission_synced_at || null,
      syncedCount: Number(settings.admission_synced_count) || 0,
      freshness: settings.admission_synced_at ? "live" : "cached",
    },
  });
}
