import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

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
  const status = body?.status;
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
  }

  // กันไม่ให้อนุมัติเล่มที่ไม่มีเนื้อหาเลย (ไม่มีทั้งไฟล์ PDF และไม่มีรูปแบบเก่า)
  // ป้องกันเล่มผลงานว่างเปล่าไปโผล่ในหน้าชุมชนนักเรียนหลังอนุมัติ
  if (status === "approved") {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.pdf_path,
              (SELECT COUNT(*) FROM portfolio_images pi WHERE pi.portfolio_id = p.id) AS imageCount
       FROM portfolios p WHERE p.id = ?`,
      [id]
    );
    if (!rows[0] || (!rows[0].pdf_path && rows[0].imageCount === 0)) {
      return NextResponse.json(
        { error: "เล่มนี้ไม่มีไฟล์ PDF หรือรูปภาพเลย อนุมัติไม่ได้ — กรุณาปฏิเสธแล้วแจ้งให้นักเรียนอัปโหลดใหม่" },
        { status: 400 }
      );
    }
  }

  await pool.query("UPDATE portfolios SET status = ? WHERE id = ?", [status, id]);

  return NextResponse.json({ ok: true });
}

// เส้นทางนี้ (/api/admin/portfolios/[id]) จะถูกเลือกใช้แทน /api/admin/[resource]/[id] เสมอ
// เพราะ Next.js ให้ความสำคัญกับ path ที่ระบุตรงตัว ("portfolios") มากกว่า path แบบ dynamic ([resource])
// ถ้าไม่มี DELETE ในไฟล์นี้ การลบพอร์ตโฟลิโอจากหน้าแอดมิน (ที่เรียกผ่าน resource CRUD ทั่วไป) จะได้ 405 เสมอ
export async function DELETE(
  _request: Request,
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

  await pool.query("DELETE FROM portfolios WHERE id = ?", [id]);

  return NextResponse.json({ ok: true });
}
