// เพิ่มข้อมูลเกณฑ์การรับสมัคร มหาวิทยาลัยเกษตรศาสตร์ (บางเขน/กำแพงแสน/เฉลิมพระเกียรติ สกลนคร/สุพรรณบุรี)
// ดึงจากเว็บจริง https://admission.ku.ac.th (ระบบกลาง มก. TCAS'70 รอบ 1) — พาร์สจาก HTML จริง ไม่ได้แต่งข้อมูลเอง
// ข้อมูลของวิทยาเขตศรีราชาถูกคัดออกแล้ว เพราะมีอยู่ในระบบแล้วจากเว็บ admissions.src.ku.ac.th (แม่นยำกว่า มีไฟล์ PDF ต้นฉบับ)
const mysql = require("mysql2/promise");
const fs = require("fs");

const CAMPUS_TO_UNI = {
  "บางเขน": { id: "KU-BKN", name: "มหาวิทยาลัยเกษตรศาสตร์ บางเขน" },
  "กำแพงแสน": { id: "KU-KPS", name: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" },
  "เฉลิมพระเกียรติ จังหวัดสกลนคร": { id: "KU-CSC", name: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร" },
  "สุพรรณบุรี": { id: "KU-SB", name: "มหาวิทยาลัยเกษตรศาสตร์ โครงการจัดตั้งวิทยาเขตสุพรรณบุรี" },
};

// ปฏิทินรับสมัครจริงต่อวิทยาเขต/รอบย่อย จากหน้า admission.ku.ac.th (ปีการศึกษา 2570)
const CALENDAR = {
  "บางเขน|1.1": { open: "18 ก.ย. 2569 - 14 ต.ค. 2569", interview: "9 พ.ย. 2569", result: "16 พ.ย. 2569" },
  "บางเขน|1.2": { open: "4 ม.ค. 2570 - 4 ก.พ. 2570", interview: "4 มี.ค. 2570", result: "5 มี.ค. 2570" },
  "กำแพงแสน|1.1": { open: "1 ต.ค. 2569 - 5 พ.ย. 2569", interview: "20 พ.ย. 2569", result: "24 พ.ย. 2569" },
  "กำแพงแสน|1.2": { open: "1 ธ.ค. 2569 - 10 ก.พ. 2570", interview: "25-26 ก.พ. 2570", result: "2 มี.ค. 2570" },
  "เฉลิมพระเกียรติ จังหวัดสกลนคร|1.1": { open: "24 ส.ค. 2569 - 19 ก.พ. 2570", interview: null, result: "หลังชำระเงิน 1 วันทำการ (ยกเว้น สาขาวิศวกรรมโยธา สัมภาษณ์ 26 ก.พ. 2570)" },
};

const SOURCE_LABEL = "ระบบรับสมัคร KU-TCAS มหาวิทยาลัยเกษตรศาสตร์";

function subroundOf(label) {
  return label.includes("1.2") ? "1.2" : "1.1";
}

function extractGpaxMin(qualification) {
  for (const line of qualification) {
    const m = line.match(/(?:GPAX|ผลการเรียนเฉลี่ยสะสม|ผลคะแนนเฉลี่ยสะสม)[\s\S]{0,60}?(?<!\d)([0-4]\.\d{2})(?!\d)/);
    if (m) return m[1];
  }
  return "ไม่ระบุ";
}

async function main() {
  const parsedFile = process.argv[2];
  const rows = JSON.parse(fs.readFileSync(parsedFile, "utf8"));
  const filtered = rows.filter((r) => r.campus && r.campus !== "ศรีราชา" && CAMPUS_TO_UNI[r.campus]);

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
  });

  const uniIds = [...new Set(filtered.map((r) => CAMPUS_TO_UNI[r.campus].id))];
  for (const id of uniIds) {
    const [existing] = await pool.query("SELECT COUNT(*) c FROM admission_criteria WHERE university_id = ?", [id]);
    if (existing[0].c > 0) {
      console.log(`ลบข้อมูล ${id} เดิม ${existing[0].c} แถวก่อน insert ใหม่`);
      await pool.query("DELETE FROM admission_criteria WHERE university_id = ?", [id]);
    }
  }

  const verifiedAt = new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
  let inserted = 0;
  let totalQuota = 0;

  for (const r of filtered) {
    const uni = CAMPUS_TO_UNI[r.campus];
    const faculty = r.faculty.replace(/\s*\([^)]*\)\s*$/, "").trim();
    const subround = subroundOf(r.projectLabel);
    const cal = CALENDAR[`${r.campus}|${subround}`] || null;

    const details = {
      description: null,
      condition: r.qualification.join(" | ") || null,
      openDateShort: cal ? cal.open : "ดูรายละเอียดวันที่แน่นอนจากประกาศจริง",
      openDateNote: null,
      closedDate: null,
      interviewDate: cal?.interview ?? null,
      interviewTime: null,
      interviewLocation: null,
      minGpaBreakdown: [],
      physicalRequirements: [],
    };

    const gpaxMin = extractGpaxMin(r.qualification);
    const criteriaSummary = `${r.projectLabel} · รับจำนวน ${r.quota} คน${cal ? ` · เปิดรับสมัคร ${cal.open}` : ""}`;
    const sourceUrl = r.criteriaId
      ? `https://admission.ku.ac.th/majors/project/${r.projectId}/#${r.criteriaId}`
      : `https://admission.ku.ac.th/majors/project/${r.projectId}/`;

    await pool.query(
      `INSERT INTO admission_criteria
        (academic_year, university, university_id, faculty, major, concentration, project_name, round, round_name,
         quota, gpax_min, score_breakdown, details_json, criteria, source_url, source_label, pdf_url,
         source_is_custom, is_manual, verified_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        "2570",
        uni.name,
        uni.id,
        faculty,
        r.major,
        null,
        r.projectLabel,
        "1",
        "รอบ 1 Portfolio",
        r.quota,
        gpaxMin,
        JSON.stringify(r.scoreBreakdown),
        JSON.stringify(details),
        criteriaSummary,
        sourceUrl,
        SOURCE_LABEL,
        null,
        1,
        1,
        verifiedAt,
      ]
    );
    inserted++;
    totalQuota += r.quota;
  }

  console.log(`เพิ่มแล้ว ${inserted} แถว รวมจำนวนรับ ${totalQuota} คน`);
  const byUni = {};
  for (const r of filtered) byUni[CAMPUS_TO_UNI[r.campus].id] = (byUni[CAMPUS_TO_UNI[r.campus].id] || 0) + 1;
  console.log(JSON.stringify(byUni));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
