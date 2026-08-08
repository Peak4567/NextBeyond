import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/upload";

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
  const files = formData.getAll("images").filter((f) => f instanceof File) as File[];

  if (!title || !faculty || !university || !school) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "กรุณาอัปโหลดรูปอย่างน้อย 1 รูป" }, { status: 400 });
  }

  const coverBg = COVER_BG_OPTIONS[Math.floor(Math.random() * COVER_BG_OPTIONS.length)];

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO portfolios
      (user_id, status, title, student_name, school, faculty, university, views, likes, page_count, tags, cover_bg)
     VALUES (?, 'pending', ?, ?, ?, ?, ?, '0', 0, ?, ?, ?)`,
    [user.id, title, user.fullName, school, faculty, university, files.length, tags, coverBg]
  );

  const portfolioId = result.insertId;

  let sortOrder = 0;
  let firstImagePath: string | null = null;
  for (const file of files) {
    try {
      const imagePath = await saveUploadedImage(file, "portfolios");
      await pool.query(
        "INSERT INTO portfolio_images (portfolio_id, image_path, sort_order) VALUES (?, ?, ?)",
        [portfolioId, imagePath, sortOrder]
      );
      if (!firstImagePath) firstImagePath = imagePath;
      sortOrder += 1;
    } catch {
      // ข้ามไฟล์ที่อัปโหลดไม่สำเร็จ (ประเภท/ขนาดไม่ถูกต้อง) แต่ยังคงเก็บเล่มที่อัปโหลดสำเร็จแล้วไว้
    }
  }

  if (firstImagePath) {
    await pool.query("UPDATE portfolios SET cover_image = ? WHERE id = ?", [
      firstImagePath,
      portfolioId,
    ]);
  }

  return NextResponse.json({ id: portfolioId });
}
