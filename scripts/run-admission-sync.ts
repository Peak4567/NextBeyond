// รันการซิงก์ TCAS จาก mytcas.com ใหม่ตรงๆ (bypass หน้า admin ที่ต้อง login) เพื่อดึงข้อมูลรอบ 2/3/4
// ที่มหาวิทยาลัยต่างๆ เพิ่งประกาศใหม่เข้ามา — pdf_url จะถูกเก็บรักษาอัตโนมัติ (ดู preservedPdfUrls ใน lib/tcasSync.ts)
// แต่ source_url จะถูกคำนวณใหม่เสมอ ดังนั้นหลังรันสคริปต์นี้ต้องรัน fix-tu-source-links.js ซ้ำอีกครั้ง
import { runAdmissionSync } from "../lib/tcasSync";

async function main() {
  console.log("เริ่มซิงก์ข้อมูล TCAS จาก mytcas.com...");
  const start = Date.now();
  const result = await runAdmissionSync();
  console.log(`เสร็จใน ${((Date.now() - start) / 1000).toFixed(1)} วินาที`);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
