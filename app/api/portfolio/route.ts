import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { saveUploadedImage, saveUploadedPdf } from "@/lib/upload";

const COVER_BG_OPTIONS = [
  "from-blue-600 to-indigo-800",
  "from-[#005a9c] to-teal-700",
  "from-orange-500 to-[#e25a3a]",
  "from-amber-500 to-red-600",
  "from-purple-600 to-[#003b73]",
  "from-cyan-600 to-blue-900",
];

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนอัปโหลด" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const faculty = String(formData.get("faculty") ?? "").trim();
  const university = String(formData.get("university") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const pdfFile = formData.get("pdf");
  const coverFile = formData.get("cover");
  const pageCount = Number(formData.get("pageCount") ?? 0) || 1;

  if (!title || !faculty || !university || !school) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
  }
  if (!(pdfFile instanceof File)) {
    return NextResponse.json({ error: "กรุณาอัปโหลดไฟล์ PDF เล่มผลงาน" }, { status: 400 });
  }

  let pdfPath: string;
  try {
    pdfPath = await saveUploadedPdf(pdfFile, "portfolios");
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  // รูปหน้าปก render มาจากหน้าแรกของ PDF ฝั่งเบราว์เซอร์แล้วส่งมาด้วย — ถ้าด้วยเหตุผลใดก็ตามไม่มีมา
  // (เช่น เบราว์เซอร์เก่าที่ render ไม่ได้) ยังคงเก็บเล่มไว้ได้ แค่ไม่มีรูปหน้าปกให้แสดงในรายการ (ใช้พื้นหลังไล่สีแทน)
  let coverPath: string | null = null;
  if (coverFile instanceof File) {
    try {
      coverPath = await saveUploadedImage(coverFile, "portfolios");
    } catch {
      // ไม่ critical — ไม่มีรูปหน้าปกก็ยังอ่านเนื้อหาเล่มจริงจาก PDF ได้ปกติ
    }
  }

  const coverBg = COVER_BG_OPTIONS[Math.floor(Math.random() * COVER_BG_OPTIONS.length)];

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO portfolios
      (user_id, status, title, student_name, school, faculty, university, views, likes, page_count, tags, cover_bg, cover_image, pdf_path)
     VALUES (?, 'pending', ?, ?, ?, ?, ?, '0', 0, ?, ?, ?, ?, ?)`,
    [user.id, title, user.fullName, school, faculty, university, pageCount, tags, coverBg, coverPath, pdfPath]
  );

  return NextResponse.json({ id: result.insertId });
}
