import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2";

// ใช้เมื่อประกาศ PDF ฉบับเดียวครอบคลุมหลายคณะ/สาขาของมหาวิทยาลัยเดียวกันในรอบเดียวกัน
// (เช่น ประกาศรับสมัครรอบ 1 Portfolio ของมหาวิทยาลัยหนึ่งที่รวมทุกคณะไว้ในไฟล์เดียว)
export async function PATCH(request: Request) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const universityId = typeof body?.universityId === "string" ? body.universityId.trim() : "";
  const round = typeof body?.round === "string" ? body.round.trim() : "";
  const pdfUrl = typeof body?.pdfUrl === "string" ? body.pdfUrl.trim() : "";

  if (!universityId || !round) {
    return NextResponse.json({ error: "ต้องระบุมหาวิทยาลัยและรอบ" }, { status: 400 });
  }
  if (pdfUrl && !/^https?:\/\//i.test(pdfUrl)) {
    return NextResponse.json({ error: "ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://" }, { status: 400 });
  }

  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE admission_criteria SET pdf_url = ? WHERE university_id = ? AND round = ?",
    [pdfUrl || null, universityId, round]
  );

  return NextResponse.json({ ok: true, pdfUrl: pdfUrl || null, affectedRows: result.affectedRows });
}
