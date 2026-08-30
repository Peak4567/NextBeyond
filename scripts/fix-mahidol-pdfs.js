// แก้ pdf_url ของมหาวิทยาลัยมหิดลให้ชี้ไปที่เกณฑ์การรับสมัครเฉพาะแต่ละสาขา/รอบจริง (ไม่ใช่ไฟล์รวมกลางแบบเดิม)
// รันหลายรอบได้ตามคณะที่ทยอยหาข้อมูลจริงมาแล้ว — ใส่ mapping ใหม่ต่อท้ายแล้วรันใหม่ได้เรื่อยๆ
const mysql = require("mysql2/promise");

// [id, pdf_url]
const UPDATES = [
  // คณะวิทยาศาสตร์ - หลักสูตรไทย (จาก https://science.mahidol.ac.th/th/tcas.php)
  [150720, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_AlphaScholarship.pdf"],
  [150719, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_DPSTScholarship.pdf"],
  [150721, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_Mathematics.pdf"],
  [150733, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_Botany.pdf"],
  [150734, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_Physics.pdf"],
  [150724, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_Chemistry.pdf"],
  [150727, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_Biology.pdf"],
  [150730, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/SC_Biotechnology.pdf"],
  // คณะวิทยาศาสตร์ - หลักสูตรนานาชาติ (SIM, จาก https://sim.sc.mahidol.ac.th/admission-timeline/)
  [150717, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150718, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150722, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150723, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150725, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150726, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150728, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150729, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150731, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150732, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150735, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  [150736, "https://sim.sc.mahidol.ac.th/wp-content/uploads/2026/08/TCAS1-1-TCAS-1-2-2570-EN.pdf"],
  // วิทยาเขตกาญจนบุรี (จาก https://ka.mahidol.ac.th/th/tcas/)
  [150778, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_ConservationBiology.pdf"],
  [150779, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_FoodTechnology.pdf"],
  [150780, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_Geoscience.pdf"],
  [150781, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_EnvironmentalEG_DisasterManagement.pdf"],
  [150782, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_AgriculturalSC.pdf"],
  [150783, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_AgriculturalSC.pdf"],
  [150784, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_Accounting.pdf"],
  [150785, "https://tcas.mahidol.ac.th/qualified/Portfolio1-1/KA_BusinessAdministration.pdf"],
  // คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี - แพทยศาสตรบัณฑิต (จาก https://www.rama.mahidol.ac.th/meded/th/rama_admission)
  [150705, "https://www.rama.mahidol.ac.th/meded/sites/default/files/public/admission/yr2570/0.2570%20%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%84%E0%B8%93%E0%B8%B0%E0%B8%AF%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%A3%20Portfolio.pdf"],
  [150706, "https://www.rama.mahidol.ac.th/meded/sites/default/files/public/admission/yr2570/0.2570%20%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%84%E0%B8%93%E0%B8%B0%E0%B8%AF%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%A3%20Portfolio.pdf"],
  [150707, "https://www.rama.mahidol.ac.th/meded/sites/default/files/public/admission/yr2570/0.2570%20%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%84%E0%B8%93%E0%B8%B0%E0%B8%AF%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%A3%20Portfolio.pdf"],
  // คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี - พยาบาลศาสตรบัณฑิต (จาก https://www.rama.mahidol.ac.th/nursing/rans/newstudent)
  [150712, "https://drive.google.com/file/d/1LCOnGmAEwOUeMk6HfM4vjsCK87wLQVyp/view"],
];

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
  });

  let updated = 0;
  for (const [id, url] of UPDATES) {
    const [result] = await pool.query("UPDATE admission_criteria SET pdf_url = ? WHERE id = ?", [url, id]);
    if (result.affectedRows > 0) updated++;
  }
  console.log(`อัปเดตแล้ว ${updated}/${UPDATES.length} แถว`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
