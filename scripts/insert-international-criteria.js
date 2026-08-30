// อัปเดตเกณฑ์การรับสมัครจริงของมหาวิทยาลัยต่างประเทศ (แปลสรุปเป็นไทย) — รับ path ของไฟล์ JSON เป็น argument
// รูปแบบ: [{ id, documents_required, test_policy, deadlines, application_fee, criteria_source_url, criteria_verified_at }]
const mysql = require("mysql2/promise");
const fs = require("fs");

async function main() {
  const jsonFile = process.argv[2];
  if (!jsonFile) {
    console.error("usage: node insert-international-criteria.js <path-to-json>");
    process.exit(1);
  }
  const records = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
  });

  let updated = 0;
  for (const r of records) {
    await pool.query(
      `UPDATE international_universities
       SET documents_required = ?, test_policy = ?, deadlines = ?, application_fee = ?,
           criteria_source_url = ?, criteria_verified_at = ?
       WHERE id = ?`,
      [
        r.documents_required ?? null,
        r.test_policy ?? null,
        r.deadlines ?? null,
        r.application_fee ?? null,
        r.criteria_source_url ?? null,
        r.criteria_verified_at ?? null,
        r.id,
      ]
    );
    updated++;
  }

  console.log(`อัปเดตแล้ว ${updated} แถว`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
