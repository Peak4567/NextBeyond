import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export type UploadFolder = "portfolios" | "news" | "settings" | "general";

async function writeUploadedFile(buffer: Buffer, ext: string, folder: UploadFolder): Promise<string> {
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const relativePath = `/uploads/${folder}/${filename}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  const absolutePath = path.join(uploadDir, filename);

  // สร้างโฟลเดอร์ปลายทางถ้ายังไม่มี — กัน ENOENT บนเซิร์ฟเวอร์ที่เพิ่ง deploy ใหม่
  await mkdir(uploadDir, { recursive: true });
  await writeFile(absolutePath, buffer);

  return relativePath;
}

export async function saveUploadedImage(file: File, folder: UploadFolder): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    // iPhone ตั้งค่าเริ่มต้นถ่ายรูปเป็น HEIC/HEIF ซึ่งเบราว์เซอร์ส่วนใหญ่แสดงผลไม่ได้ — บอกเหตุผลที่ชัดเจนกว่าแค่ "ไม่รองรับ"
    if (file.type === "image/heic" || file.type === "image/heif" || /\.heic$|\.heif$/i.test(file.name)) {
      throw new Error(
        `ไฟล์ "${file.name}" เป็นไฟล์ HEIC/HEIF (รูปแบบเริ่มต้นของกล้อง iPhone) เบราว์เซอร์ส่วนใหญ่แสดงผลไม่ได้ กรุณาเปลี่ยนเป็น JPG หรือ PNG ก่อนอัปโหลด (ตั้งค่า iPhone > กล้อง > รูปแบบ > ใช้ความเข้ากันได้สูงสุด)`
      );
    }
    throw new Error(`ไฟล์ "${file.name}" ไม่ใช่รูปภาพที่รองรับ (รองรับเฉพาะ PNG, JPEG, WEBP, GIF)`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`ไฟล์ "${file.name}" มีขนาดเกิน 8MB`);
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const buffer = Buffer.from(await file.arrayBuffer());
  return writeUploadedFile(buffer, ext, folder);
}

export async function saveUploadedPdf(file: File, folder: UploadFolder): Promise<string> {
  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
    throw new Error(`ไฟล์ "${file.name}" ไม่ใช่ไฟล์ PDF`);
  }
  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error(`ไฟล์ "${file.name}" มีขนาดเกิน 25MB`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return writeUploadedFile(buffer, "pdf", folder);
}
