// พาร์สหน้า HTML เกณฑ์ของ admission.ku.ac.th (ระบบกลาง มก.) ให้เป็นแถวข้อมูลสำหรับ insert
const fs = require("fs");
const path = require("path");

function stripTags(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30) || "other";
}

function badgeFromText(text) {
  const match = text.match(/^(.*?)\s*สัดส่วน(?:ย่อย)?\s*([\d.]+)\s*$/);
  if (!match) return null;
  const label = match[1].trim().replace(/[.:：]\s*$/, "");
  const weight = parseFloat(match[2]);
  if (!label || Number.isNaN(weight)) return null;
  return { key: slugify(label), label, weight };
}

// เดินลง tree เกณฑ์คะแนน: ถ้า <li> มี <ol> ซ้อนอยู่ข้างใน แปลว่ามันอาจเป็นแค่หัวข้อ/กลุ่ม
// - ถ้าลูกข้างในมีสัดส่วนของตัวเอง (เช่น Portfolio 70%, ครบถ้วน 10% ...) ให้ใช้ค่าจากลูกแทน (ไม่นับเลขของหัวข้อ กันนับซ้ำ)
// - แต่ถ้าลูกข้างในไม่มีสัดส่วนเลย (เป็นแค่รายละเอียดอธิบาย ไม่ใช่คะแนนย่อย) ให้ใช้สัดส่วนของหัวข้อเองแทน เพราะนั่นคือค่าจริงเพียงค่าเดียวที่มี
function collectBadges(ol, badges) {
  const items = splitTopLevelLi(ol);
  for (const raw of items) {
    const nestedOl = findTopLevelNestedOl(raw);
    if (nestedOl) {
      const childBadges = [];
      collectBadges(nestedOl, childBadges);
      if (childBadges.length > 0) {
        badges.push(...childBadges);
      } else {
        const ownText = stripTags(raw.split(/<ol\b/)[0]);
        const badge = badgeFromText(ownText);
        if (badge) badges.push(badge);
      }
      continue;
    }
    const badge = badgeFromText(stripTags(raw));
    if (badge) badges.push(badge);
  }
}

// แยก <li>...</li> ระดับบนสุดของ <ol> นี้เท่านั้น (ไม่แตกลูกที่ซ้อนอยู่ข้างใน) โดยนับความลึกของ ol/li เอง
function splitTopLevelLi(olInnerHtml) {
  const items = [];
  let depth = 0;
  let current = "";
  let i = 0;
  const tagRegex = /<li>|<\/li>|<ol\b[^>]*>|<\/ol>/g;
  let lastIndex = 0;
  let collecting = false;
  let liDepthAtStart = 0;
  while (i < olInnerHtml.length) {
    tagRegex.lastIndex = i;
    const m = tagRegex.exec(olInnerHtml);
    if (!m) break;
    if (m[0] === "<li>" && depth === 0) {
      collecting = true;
      current = "";
      lastIndex = m.index + m[0].length;
    } else if (m[0] === "<ol" || m[0].startsWith("<ol")) {
      depth++;
    } else if (m[0] === "</ol>") {
      depth--;
    } else if (m[0] === "</li>" && depth === 0 && collecting) {
      current = olInnerHtml.slice(lastIndex, m.index);
      items.push(current);
      collecting = false;
    }
    i = m.index + m[0].length;
  }
  return items;
}

function findTopLevelNestedOl(liHtml) {
  const m = liHtml.match(/<ol\b[^>]*>([\s\S]*)<\/ol>\s*(?:<style>[\s\S]*?<\/style>)?\s*$/);
  return m ? m[1] : null;
}

function parseScoreBreakdown(td4Html) {
  const outerOlMatch = td4Html.match(/<ol\b[^>]*>([\s\S]*)<\/ol>/);
  if (!outerOlMatch) return [];
  const badges = [];
  collectBadges(outerOlMatch[1], badges);
  return badges;
}

// ต่างจาก collectBadges: ข้อความของคุณสมบัติเป็นรายละเอียดเสริมกัน ไม่ใช่ค่าทดแทนกัน
// ถ้า <li> มี <ol> ซ้อนอยู่ข้างใน ต้องเก็บทั้งข้อความของหัวข้อเอง "และ" ของลูกทุกตัว (ไม่ใช่เลือกอย่างใดอย่างหนึ่ง)
function collectQualificationItems(ol, items) {
  const rawItems = splitTopLevelLi(ol);
  for (const raw of rawItems) {
    const nestedOl = findTopLevelNestedOl(raw);
    if (nestedOl) {
      const ownText = stripTags(raw.split(/<ol\b/)[0]);
      if (ownText) items.push(ownText);
      collectQualificationItems(nestedOl, items);
    } else {
      const text = stripTags(raw);
      if (text) items.push(text);
    }
  }
}

function parseQualification(td3Html) {
  const outerOlMatch = td3Html.match(/<ol\b[^>]*>([\s\S]*)<\/ol>/);
  if (!outerOlMatch) return [];
  const items = [];
  collectQualificationItems(outerOlMatch[1], items);
  return items;
}

function extractCampus(facultyHeaderText) {
  const m =
    facultyHeaderText.match(/\(วิทยาเขต([^)]+)\)/) ||
    facultyHeaderText.match(/\(([^)]*สกลนคร[^)]*)\)/) ||
    facultyHeaderText.match(/\((สุพรรณบุรี)\)/);
  if (!m) return null;
  return m[1].trim();
}

const CAMPUS_TO_UNI = {
  "บางเขน": { id: "KU-BKN", name: "มหาวิทยาลัยเกษตรศาสตร์ บางเขน" },
  "กำแพงแสน": { id: "KU-KPS", name: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" },
  "ศรีราชา": { id: "KU-SRC", name: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา" },
  "เฉลิมพระเกียรติ จังหวัดสกลนคร": { id: "KU-CSC", name: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร" },
  "สกลนคร": { id: "KU-CSC", name: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร" },
  "สุพรรณบุรี": { id: "KU-SB", name: "มหาวิทยาลัยเกษตรศาสตร์ โครงการจัดตั้งวิทยาเขตสุพรรณบุรี" },
};

function parseProject(html, projectId, projectLabel) {
  const rows = [];
  const trBlocks = html.split(/<tr\b/).slice(1);
  let currentFaculty = null;
  let currentCampus = null;

  for (const block of trBlocks) {
    const end = block.indexOf("</tr>");
    const body = block.slice(0, end);

    if (body.includes("table-info")) {
      const thMatch = body.match(/<th[^>]*>([\s\S]*?)<\/th>/);
      if (thMatch) {
        currentFaculty = stripTags(thMatch[0]);
        currentCampus = extractCampus(currentFaculty);
      }
      continue;
    }

    const tdMatches = [...body.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)];
    if (tdMatches.length !== 4) continue; // ข้ามแถวที่ merge ด้วย rowspan (ข้อมูลจริงไม่พบ, ส่วนใหญ่เป็น redirect ไปเว็บวิทยาเขตอื่น)

    const [majorRaw, quotaRaw, qualRaw, scoreRaw] = tdMatches.map((m) => m[1]);
    const major = stripTags(majorRaw);
    const quotaText = stripTags(quotaRaw);
    const quota = parseInt(quotaText.replace(/[^\d]/g, ""), 10) || 0;

    if (qualRaw.includes("อ่านรายละเอียดได้ที่") || scoreRaw.includes("อ่านรายละเอียดได้ที่")) {
      continue; // ข้อมูลจริงอยู่ที่เว็บวิทยาเขตอื่น (เก็บแยกไปแล้ว เช่น ศรีราชา)
    }

    const idMatch = qualRaw.match(/#(\d+)/);
    const criteriaId = idMatch ? idMatch[1] : null;

    rows.push({
      projectId,
      projectLabel,
      faculty: currentFaculty,
      campus: currentCampus,
      major,
      quota,
      qualification: parseQualification(qualRaw),
      scoreBreakdown: parseScoreBreakdown(scoreRaw),
      criteriaId,
    });
  }

  return rows;
}

function main() {
  const scratchDir = process.argv[2];
  const outFile = process.argv[3];
  const files = fs.readdirSync(scratchDir).filter((f) => f.startsWith("project_"));

  const labels = {
    1: "โครงการช้างเผือก (รอบ 1.1)",
    101: "โครงการช้างเผือก (รอบ 1.2)",
    2: "โครงการเรียนล่วงหน้า",
    3: "หลักสูตรนานาชาติและหลักสูตรภาษาอังกฤษ (รอบ 1.1)",
    103: "หลักสูตรนานาชาติและหลักสูตรภาษาอังกฤษ (รอบ 1.2)",
    4: "โครงการรับนักกีฬาดีเด่น",
    5: "โครงการส่งเสริมนักเรียนที่มีคุณธรรมและจริยธรรม",
    6: "โครงการความรู้คู่คุณธรรมสร้างผู้นำเยาวชน",
    7: "โครงการขยายโอกาสทางการศึกษา (สกลนคร)",
    107: "โครงการขยายโอกาสทางการศึกษา (ศรีราชา รอบ 1.1)",
    207: "โครงการขยายโอกาสทางการศึกษา (ศรีราชา รอบ 1.2)",
    8: "โครงการพัฒนาและส่งเสริมผู้มีความสามารถพิเศษทางวิทยาศาสตร์และเทคโนโลยี (พสวท.)",
    9: "โครงการโอลิมปิกวิชาการ (รอบ 1.1)",
    109: "โครงการโอลิมปิกวิชาการ (รอบ 1.2)",
    10: "โครงการรับเข้าด้วยแฟ้มสะสมผลงาน (Portfolio) (รอบ 1.1)",
    110: "โครงการรับเข้าด้วยแฟ้มสะสมผลงาน (Portfolio) (รอบ 1.2)",
    18: "โครงการโควตาศิลปวัฒนธรรมและซอฟต์พาวเวอร์",
    32: "โครงการพัฒนาเครือข่ายองค์กรแห่งการเรียนรู้ด้านวิทยาศาสตร์สู่การต่อยอดระดับสากล",
    33: "โครงการส่งเสริมการผลิตครูที่มีความสามารถพิเศษทางวิทยาศาสตร์และคณิตศาสตร์ (สควค.)",
  };

  let allRows = [];
  const summary = [];
  for (const f of files) {
    const id = parseInt(f.match(/project_(\d+)\.html/)[1], 10);
    const html = fs.readFileSync(path.join(scratchDir, f), "utf8");
    const rows = parseProject(html, id, labels[id] || `project-${id}`);
    allRows = allRows.concat(rows);
    const campusCounts = {};
    for (const r of rows) {
      const c = r.campus || "ไม่ระบุ";
      campusCounts[c] = (campusCounts[c] || 0) + 1;
    }
    summary.push({ id, label: labels[id], rowCount: rows.length, campusCounts });
  }

  fs.writeFileSync(outFile, JSON.stringify(allRows, null, 1), "utf8");
  console.log("total rows parsed:", allRows.length);
  console.log(JSON.stringify(summary, null, 1));
}

if (require.main === module) {
  main();
}

module.exports = { parseScoreBreakdown, parseQualification, parseProject, stripTags };
