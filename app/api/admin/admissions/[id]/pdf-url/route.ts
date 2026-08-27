import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// เส้นทางนี้ตั้งใจใช้ path 3 ระดับ (ไม่ใช่ /api/admin/admissions/[id] ตรงๆ)
// เพื่อไม่ไปบัง /api/admin/[resource]/[id] ซึ่งเป็นเส้นทางลบข้อมูลทั่วไปของทุก resource
// (บทเรียนจากบั๊กเดิมที่ /api/admin/portfolios/[id] เคยไปบังปุ่มลบพอร์ตโฟลิโอ)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const pdfUrl = typeof body?.pdfUrl === "string" ? body.pdfUrl.trim() : "";

  if (pdfUrl && !/^https?:\/\//i.test(pdfUrl)) {
    return NextResponse.json({ error: "ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://" }, { status: 400 });
  }

  await pool.query("UPDATE admission_criteria SET pdf_url = ? WHERE id = ?", [
    pdfUrl || null,
    id,
  ]);

  return NextResponse.json({ ok: true, pdfUrl: pdfUrl || null });
}
