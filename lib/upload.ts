import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export type UploadFolder = "portfolios" | "news" | "settings" | "general";

export async function saveUploadedImage(file: File, folder: UploadFolder): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("รองรับเฉพาะไฟล์รูปภาพ PNG, JPEG, WEBP, GIF เท่านั้น");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("ขนาดไฟล์ต้องไม่เกิน 8MB");
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const relativePath = `/uploads/${folder}/${filename}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  const absolutePath = path.join(uploadDir, filename);

  // สร้างโฟลเดอร์ปลายทางถ้ายังไม่มี — กัน ENOENT บนเซิร์ฟเวอร์ที่เพิ่ง deploy ใหม่
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return relativePath;
}
