import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.title, p.student_name AS studentName, p.faculty, p.university,
            p.status, p.created_at AS createdAt, p.page_count AS pageCount,
            p.pdf_path AS pdfPath,
            COALESCE(p.cover_image, (SELECT image_path FROM portfolio_images pi WHERE pi.portfolio_id = p.id ORDER BY sort_order, id LIMIT 1)) AS coverImage
     FROM portfolios p
     WHERE p.status = 'pending'
     ORDER BY p.created_at ASC`
  );

  return NextResponse.json({ portfolios: rows });
}
