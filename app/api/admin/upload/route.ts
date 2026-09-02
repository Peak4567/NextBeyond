import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { saveUploadedImage, saveUploadedPdf, type UploadFolder } from "@/lib/upload";

const ALLOWED_FOLDERS = new Set<UploadFolder>(["news", "settings", "general", "portfolios"]);

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderInput = String(formData.get("folder") ?? "general");
  const folder = ALLOWED_FOLDERS.has(folderInput as UploadFolder)
    ? (folderInput as UploadFolder)
    : "general";
  const fileKind = String(formData.get("type") ?? "image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
  }

  try {
    const url = fileKind === "pdf" ? await saveUploadedPdf(file, folder) : await saveUploadedImage(file, folder);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
