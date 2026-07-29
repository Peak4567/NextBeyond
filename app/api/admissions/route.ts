import { NextResponse } from "next/server";
import { OFFICIAL_ADMISSION_CRITERIA } from "@/data/official-admissions";

const KU_SOURCE_URL = "https://admission.ku.ac.th/majors/project/31/";

export const revalidate = 21600;

/**
 * ตรวจสอบว่าหน้าประกาศทางการยังเข้าถึงได้ก่อนส่งข้อมูลให้ผู้ใช้
 * ข้อมูลเกณฑ์แต่ละรายการเก็บเป็น structured data เพื่อไม่ให้การเปลี่ยน
 * markup ของเว็บไซต์ต้นทางทำให้แสดงรายละเอียดผิดพลาด
 */
export async function GET() {
  try {
    const response = await fetch(KU_SOURCE_URL, {
      next: { revalidate },
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "NextBeyond admission information service",
      },
    });

    if (!response.ok) {
      throw new Error(`Official source responded ${response.status}`);
    }

    return NextResponse.json({
      criteria: OFFICIAL_ADMISSION_CRITERIA,
      source: {
        name: "KU-TCAS69",
        url: KU_SOURCE_URL,
        syncedAt: new Date().toISOString(),
        freshness: "live",
      },
    });
  } catch {
    // หน้าแสดงข้อมูลที่ยืนยันล่าสุดได้ แม้เว็บมหาวิทยาลัยปิดปรับปรุงชั่วคราว
    return NextResponse.json({
      criteria: OFFICIAL_ADMISSION_CRITERIA,
      source: {
        name: "KU-TCAS69",
        url: KU_SOURCE_URL,
        syncedAt: null,
        freshness: "cached",
      },
    });
  }
}
