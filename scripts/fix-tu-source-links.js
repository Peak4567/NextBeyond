// แก้ไขลิงก์เกณฑ์การรับสมัครของมหาวิทยาลัยธรรมศาสตร์ที่เสีย:
// 1. pdf_url เดิมเป็นไฟล์ที่ใช้งานไม่ได้จริง (คืนค่าเป็นหน้า HTML ไม่ใช่ PDF) — แทนที่ด้วยไฟล์ประกาศรอบ 1
//    Portfolio ปีการศึกษา 2570 ฉบับจริงที่ยังใช้งานได้ (ตรวจสอบแล้วว่าเป็น PDF จริง ขนาด 1.7MB)
// 2. source_url บางแถวมีข้อความอื่นที่ไม่ใช่ URL เลย (เช่น "Link ZOOM", ข้อความนัดสัมภาษณ์)
//    ซึ่งเป็นผลจากการซิงก์ที่ดึงคอลัมน์ผิด (หมายเหตุ แทนที่จะเป็นลิงก์จริง) — แทนที่ด้วยหน้าเกณฑ์การรับสมัครของ มธ. โดยตรง
const mysql = require("mysql2/promise");

const CORRECT_PDF_URL = "https://www.tuadmissions.in.th/img/2026082807385532.pdf";
const FALLBACK_SOURCE_URL = "https://www.tuadmissions.in.th/admissions";

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
  });

  const [pdfResult] = await pool.query(
    "UPDATE admission_criteria SET pdf_url = ? WHERE university = 'มหาวิทยาลัยธรรมศาสตร์'",
    [CORRECT_PDF_URL]
  );
  console.log(`แก้ pdf_url: ${pdfResult.affectedRows} แถว`);

  const [urlResult] = await pool.query(
    "UPDATE admission_criteria SET source_url = ? WHERE university = 'มหาวิทยาลัยธรรมศาสตร์' AND source_url NOT LIKE 'http%'",
    [FALLBACK_SOURCE_URL]
  );
  console.log(`แก้ source_url ที่ไม่ใช่ลิงก์จริง: ${urlResult.affectedRows} แถว`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
