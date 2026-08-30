// ดึงหน้าเกณฑ์ทั้ง 19 โครงการจาก admission.ku.ac.th (ระบบกลาง มก. บางเขน+อื่นๆ) มาเก็บไว้ตรวจสอบก่อน insert
const fs = require("fs");
const path = require("path");

const PROJECTS = [
  { id: 1, label: "โครงการช้างเผือก (รอบ 1.1)" },
  { id: 101, label: "โครงการช้างเผือก (รอบ 1.2)" },
  { id: 2, label: "โครงการเรียนล่วงหน้า" },
  { id: 3, label: "หลักสูตรนานาชาติและหลักสูตรภาษาอังกฤษ (รอบ 1.1)" },
  { id: 103, label: "หลักสูตรนานาชาติและหลักสูตรภาษาอังกฤษ (รอบ 1.2)" },
  { id: 4, label: "โครงการรับนักกีฬาดีเด่น" },
  { id: 5, label: "โครงการส่งเสริมนักเรียนที่มีคุณธรรมและจริยธรรม" },
  { id: 6, label: "โครงการความรู้คู่คุณธรรมสร้างผู้นำเยาวชน" },
  { id: 7, label: "โครงการขยายโอกาสทางการศึกษา (สกลนคร)" },
  { id: 107, label: "โครงการขยายโอกาสทางการศึกษา (ศรีราชา รอบ 1.1)" },
  { id: 207, label: "โครงการขยายโอกาสทางการศึกษา (ศรีราชา รอบ 1.2)" },
  { id: 8, label: "โครงการพัฒนาและส่งเสริมผู้มีความสามารถพิเศษทางวิทยาศาสตร์และเทคโนโลยี (พสวท.)" },
  { id: 9, label: "โครงการโอลิมปิกวิชาการ (รอบ 1.1)" },
  { id: 109, label: "โครงการโอลิมปิกวิชาการ (รอบ 1.2)" },
  { id: 10, label: "โครงการรับเข้าด้วยแฟ้มสะสมผลงาน (Portfolio) (รอบ 1.1)" },
  { id: 110, label: "โครงการรับเข้าด้วยแฟ้มสะสมผลงาน (Portfolio) (รอบ 1.2)" },
  { id: 18, label: "โครงการโควตาศิลปวัฒนธรรมและซอฟต์พาวเวอร์" },
  { id: 32, label: "โครงการพัฒนาเครือข่ายองค์กรแห่งการเรียนรู้ด้านวิทยาศาสตร์สู่การต่อยอดระดับสากล" },
  { id: 33, label: "โครงการส่งเสริมการผลิตครูที่มีความสามารถพิเศษทางวิทยาศาสตร์และคณิตศาสตร์ (สควค.)" },
];

const outDir = path.join(__dirname, "..", "..", "ku_raw");

async function main() {
  const scratchDir = process.argv[2];
  if (!scratchDir) {
    console.error("usage: node ku-bangkhen-fetch.js <outDir>");
    process.exit(1);
  }
  fs.mkdirSync(scratchDir, { recursive: true });

  for (const p of PROJECTS) {
    const url = `https://admission.ku.ac.th/majors/project/${p.id}/`;
    const res = await fetch(url);
    const html = await res.text();
    fs.writeFileSync(path.join(scratchDir, `project_${p.id}.html`), html, "utf8");
    console.log(`fetched project ${p.id}: ${html.length} bytes`);
  }
}

main();
