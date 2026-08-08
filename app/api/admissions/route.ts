import { NextResponse } from "next/server";
import { getAdmissionCriteria } from "@/lib/data";
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

  const [{ items, total }, settings] = await Promise.all([
    getAdmissionCriteria({ q, round, limit: 50 }),
    getSettings(),
  ]);

  return NextResponse.json({
    criteria: items,
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
