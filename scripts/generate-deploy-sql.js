// สร้างไฟล์ .sql รวมการแก้ไขข้อมูล (ธรรมศาสตร์ + มหิดล) แบบ idempotent — จับคู่ด้วย university/faculty/major
// ไม่ใช้ id ตรงๆ เพราะ id บนเซิร์ฟเวอร์ production อาจไม่ตรงกับเครื่องนี้ (auto-increment คนละชุด)
const mysql = require("mysql2/promise");
const fs = require("fs");

function esc(pool, val) {
  return pool.escape(val);
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
  });

  const lines = [];
  lines.push("-- อัปเดตเกณฑ์ PDF ที่แก้ไขแล้ว (ธรรมศาสตร์ + มหิดล) — รันซ้ำได้ปลอดภัย (idempotent)");
  lines.push("-- จับคู่ด้วย university/faculty/major ไม่ใช้ id เพราะ auto-increment บนเซิร์ฟเวอร์อาจไม่ตรงกับเครื่องนี้\n");

  // ธรรมศาสตร์: pdf_url เดียวกันทั้งหมด
  const [tuRows] = await pool.query(
    "SELECT DISTINCT pdf_url FROM admission_criteria WHERE university = 'มหาวิทยาลัยธรรมศาสตร์'"
  );
  if (tuRows.length > 0) {
    lines.push(
      `UPDATE admission_criteria SET pdf_url = ${esc(pool, tuRows[0].pdf_url)} WHERE university = 'มหาวิทยาลัยธรรมศาสตร์';`
    );
  }
  // ธรรมศาสตร์: แก้ source_url ที่เป็นขยะให้กลับไปเป็นหน้าเกณฑ์การรับสมัครโดยตรง (ครอบคลุมกรณีข้อมูลจริงยังเป็นขยะอยู่)
  lines.push(
    `UPDATE admission_criteria SET source_url = 'https://www.tuadmissions.in.th/admissions' WHERE university = 'มหาวิทยาลัยธรรมศาสตร์' AND source_url NOT LIKE 'http%';\n`
  );

  // มหิดล: อัปเดตทีละแถวตาม faculty+major+pdf_url ปัจจุบัน
  const [muRows] = await pool.query(
    `SELECT faculty, major, pdf_url FROM admission_criteria
     WHERE university = 'มหาวิทยาลัยมหิดล' AND pdf_url != 'https://tcas.mahidol.ac.th/qualified/Portfolio.pdf'`
  );
  for (const r of muRows) {
    lines.push(
      `UPDATE admission_criteria SET pdf_url = ${esc(pool, r.pdf_url)} WHERE university = 'มหาวิทยาลัยมหิดล' AND faculty = ${esc(pool, r.faculty)} AND major = ${esc(pool, r.major)};`
    );
  }

  fs.writeFileSync("deploy-updates-criteria.sql", lines.join("\n") + "\n", "utf8");
  console.log(`เขียนแล้ว ${lines.length} บรรทัด ไปที่ deploy-updates-criteria.sql`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
