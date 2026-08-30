import { NextResponse } from "next/server";
import { getInternationalUniversities } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * รายชื่อมหาวิทยาลัยต่างประเทศ (ข้อมูลพื้นฐาน ไม่ใช่ระบบ TCAS) จัดอันดับตาม QS World University
 * Rankings 2027 — ครอบคลุมเฉพาะ Top 30 ต่อประเทศที่เพิ่มไว้ (สหรัฐอเมริกา, จีน) ไม่ใช่ทุกมหาวิทยาลัยในโลก
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.trim() || undefined;
  const universities = await getInternationalUniversities(country);
  return NextResponse.json({
    universities,
    source: {
      name: "QS World University Rankings 2027",
      url: "https://www.topuniversities.com/world-university-rankings",
      publishedAt: "18 มิ.ย. 2569",
    },
  });
}
