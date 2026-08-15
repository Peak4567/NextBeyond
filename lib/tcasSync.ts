import { pool } from "@/lib/db";
import { updateSettings } from "@/lib/settings";
import type { RowDataPacket } from "mysql2";

const TCAS_DATA_BASE = "https://my-tcas.s3.ap-southeast-1.amazonaws.com/mytcas";

const ROUND_NAMES: Record<string, string> = {
  "1": "รอบ 1 Portfolio",
  "2": "รอบ 2 Quota",
  "3": "รอบ 3 Admission",
  "4": "รอบ 4 Direct Admission",
};

// ปฏิทิน TCAS70 ฉบับทางการจาก mytcas.com (ตรวจสอบแล้ว) — วันเปิดรับสมัครระดับประเทศต่อรอบ
// รอบ 1-2 แต่ละมหาวิทยาลัยกำหนดวันของตัวเองภายในกรอบนี้ ส่วนรอบ 3-4 เป็นวันที่ตายตัวทั้งประเทศ
const ROUND_OPEN_INFO: Record<string, { short: string; note: string }> = {
  "1": {
    short: "15 ส.ค. 2569 เป็นต้นไป",
    note: "แต่ละมหาวิทยาลัยกำหนดวันรับสมัครเองภายในช่วงนี้ (เริ่มตั้งแต่ 15 ส.ค. 2569 เป็นต้นไป) โปรดตรวจสอบวันที่แน่นอนจากมหาวิทยาลัยโดยตรง",
  },
  "2": {
    short: "13 มี.ค. 2570 เป็นต้นไป",
    note: "แต่ละมหาวิทยาลัยกำหนดวันรับสมัครเองภายในช่วงนี้ (เริ่มตั้งแต่ 13 มี.ค. 2570 เป็นต้นไป) โปรดตรวจสอบวันที่แน่นอนจากมหาวิทยาลัยโดยตรง",
  },
  "3": {
    short: "7-11 พ.ค. 2570",
    note: "รับสมัครพร้อมกันทั่วประเทศผ่านระบบ mytcas.com วันที่ 7-11 พ.ค. 2570 (ช่วงเพิ่มเติม 12-13 พ.ค. 2570)",
  },
  "4": {
    short: "29 พ.ค. - 15 มิ.ย. 2570",
    note: "รับสมัครผ่านระบบของแต่ละมหาวิทยาลัยเอง วันที่ 29 พ.ค. - 15 มิ.ย. 2570",
  },
};

// รหัสคะแนน TCAS มาตรฐานของ ทปอ. -> ป้ายภาษาไทยสำหรับแสดงผล
const SCORE_LABELS: Record<string, string> = {
  gpax: "GPAX",
  gpa21: "GPA กลุ่มสาระภาษาไทย",
  gpa22: "GPA กลุ่มสาระสังคมศึกษา",
  gpa23: "GPA กลุ่มสาระภาษาต่างประเทศ",
  gpa24: "GPA กลุ่มสาระคณิตศาสตร์",
  gpa25: "GPA กลุ่มสาระวิทยาศาสตร์",
  gpa26: "GPA กลุ่มสาระสุขศึกษาและพลศึกษา",
  gpa27: "GPA กลุ่มสาระศิลปะ",
  gpa28: "GPA กลุ่มสาระการงานอาชีพ",
  tgat: "TGAT",
  tgat1: "TGAT1 การสื่อสารภาษาอังกฤษ",
  tgat2: "TGAT2 การคิดอย่างมีเหตุผล",
  tgat3: "TGAT3 สมรรถนะการทำงาน",
  tpat1: "TPAT1 กสพท (แพทย์)",
  tpat2: "TPAT2 ศิลปกรรมศาสตร์",
  tpat3: "TPAT3 วิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์",
  tpat5: "TPAT5 ครุศาสตร์/ศึกษาศาสตร์",
  a_lv_61: "A-Level คณิตศาสตร์ประยุกต์ 1",
  a_lv_62: "A-Level คณิตศาสตร์ประยุกต์ 2",
  a_lv_63: "A-Level วิทยาศาสตร์ประยุกต์",
  a_lv_64: "A-Level ฟิสิกส์",
  a_lv_65: "A-Level เคมี",
  a_lv_66: "A-Level ชีววิทยา",
  a_lv_70: "A-Level สังคมศึกษา",
  a_lv_81: "A-Level ภาษาไทย",
  a_lv_82: "A-Level ภาษาอังกฤษ",
  a_lv_83: "A-Level ภาษาฝรั่งเศส",
  a_lv_84: "A-Level ภาษาเยอรมัน",
  a_lv_85: "A-Level ภาษาญี่ปุ่น",
  a_lv_86: "A-Level ภาษาเกาหลี",
  a_lv_87: "A-Level ภาษาจีน",
  a_lv_88: "A-Level ภาษาบาลี",
  a_lv_89: "A-Level ภาษาสเปน",
  portfolio: "แฟ้มสะสมผลงาน (Portfolio)",
  interview: "สัมภาษณ์",
};

// กลุ่มสาระสำหรับฟิลด์ min_gpaXX (ใช้ป้ายเดียวกับ SCORE_LABELS โดยตัด prefix "min_" ออก)
const GPA_FIELD_KEYS = ["gpa21", "gpa22", "gpa23", "gpa24", "gpa25", "gpa26", "gpa27", "gpa28"];

interface TcasCourse {
  program_id: string;
  university_id: string;
  university_name_th: string;
  faculty_name_th: string;
  program_name_th: string;
  program_type_name_th: string;
}

interface TcasFolio {
  closed_date?: string;
  page_limit?: string;
}

interface TcasRound {
  type: string;
  receive_student_number: number;
  link: string;
  description?: string;
  condition?: string;
  interview_date?: string;
  interview_time?: string;
  interview_location?: string;
  score_conditions?: { min_gpax?: number };
  scores?: Record<string, number>;
  folio?: TcasFolio;
  min_gpax?: number;
  min_total_score?: number;
  min_age?: number;
  max_age?: number;
  min_height_female?: number;
  min_height_male?: number;
  min_weight_female?: number;
  min_weight_male?: number;
  max_weight_female?: number;
  max_weight_male?: number;
  [key: string]: unknown;
}

interface PortalOverride {
  keyword: string;
  label: string;
  url: string;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchAllCourses() {
  const data = await fetchJson<TcasCourse[]>(`${TCAS_DATA_BASE}/courses.json`);
  return data ?? [];
}

async function fetchRoundsForProgram(programId: string) {
  const data = await fetchJson<TcasRound[]>(`${TCAS_DATA_BASE}/rounds/${programId}.json`);
  return data ?? [];
}

async function fetchPortalOverrides(): Promise<PortalOverride[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT university_keyword AS keyword, portal_label AS label, portal_url AS url FROM university_portal_overrides ORDER BY sort_order, id"
  );
  return rows as PortalOverride[];
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

interface ScoreBadge {
  key: string;
  label: string;
  weight: number;
}

interface RequirementBadge {
  label: string;
  value: string;
}

interface CriteriaDetails {
  description: string | null;
  condition: string | null;
  openDateShort: string | null;
  openDateNote: string | null;
  closedDate: string | null;
  interviewDate: string | null;
  interviewTime: string | null;
  interviewLocation: string | null;
  minGpaBreakdown: RequirementBadge[];
  physicalRequirements: RequirementBadge[];
}

function isReadableThai(text: string | undefined | null): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  // ข้อมูลบางฟิลด์ของ TCAS เพี้ยนเป็น "?" จำนวนมาก — กรองทิ้งถ้าเจอ
  const qMarks = (trimmed.match(/\?/g) ?? []).length;
  if (qMarks > trimmed.length * 0.2) return null;
  return trimmed;
}

function formatThaiDate(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  // TCAS บางรอบมีค่า placeholder เช่นปี 1970 ที่ไม่ใช่วันจริง — กรองทิ้ง
  if (date.getFullYear() < 2024) return null;
  return date.toLocaleDateString("th-TH", { day: "2-digit", month: "long", year: "numeric" });
}

function buildScoreBadges(scores: Record<string, number> | undefined): ScoreBadge[] {
  if (!scores) return [];
  return Object.entries(scores)
    .filter(([, weight]) => typeof weight === "number" && weight > 0)
    .map(([key, weight]) => ({ key, label: SCORE_LABELS[key] ?? key.toUpperCase(), weight }))
    .sort((a, b) => b.weight - a.weight);
}

function buildMinGpaBreakdown(round: TcasRound): RequirementBadge[] {
  const badges: RequirementBadge[] = [];
  for (const key of GPA_FIELD_KEYS) {
    const value = round[`min_${key}`];
    if (typeof value === "number" && value > 0) {
      badges.push({ label: SCORE_LABELS[key] ?? key.toUpperCase(), value: value.toFixed(2) });
    }
  }
  return badges;
}

function buildPhysicalRequirements(round: TcasRound): RequirementBadge[] {
  const badges: RequirementBadge[] = [];

  if (typeof round.min_age === "number" && round.min_age > 0) {
    badges.push({ label: "อายุขั้นต่ำ", value: `${round.min_age} ปี` });
  }
  if (typeof round.max_age === "number" && round.max_age > 0) {
    badges.push({ label: "อายุไม่เกิน", value: `${round.max_age} ปี` });
  }
  if (typeof round.min_height_male === "number" && round.min_height_male > 0) {
    badges.push({ label: "ส่วนสูงชาย", value: `≥ ${round.min_height_male} ซม.` });
  }
  if (typeof round.min_height_female === "number" && round.min_height_female > 0) {
    badges.push({ label: "ส่วนสูงหญิง", value: `≥ ${round.min_height_female} ซม.` });
  }
  if (typeof round.min_weight_male === "number" && round.min_weight_male > 0) {
    badges.push({ label: "น้ำหนักชายขั้นต่ำ", value: `${round.min_weight_male} กก.` });
  }
  if (typeof round.min_weight_female === "number" && round.min_weight_female > 0) {
    badges.push({ label: "น้ำหนักหญิงขั้นต่ำ", value: `${round.min_weight_female} กก.` });
  }

  return badges;
}

// เขียนสรุปเองจากข้อมูลจริงที่ดึงมาได้ ไม่ชี้ให้ไปอ่านที่อื่น
function buildCriteriaSummary(
  badges: ScoreBadge[],
  closedDate: string | null,
  openDateShort: string | null,
  roundName: string,
  quota: number
): string {
  const parts: string[] = [];

  if (badges.length > 0) {
    parts.push(`พิจารณาจาก ${badges.map((b) => `${b.label} ${b.weight}%`).join(" + ")}`);
  } else {
    parts.push(`คัดเลือกตามเกณฑ์ของ${roundName}`);
  }

  parts.push(`รับจำนวน ${quota} คน`);

  if (openDateShort) {
    parts.push(`เปิดรับสมัคร ${openDateShort}`);
  }

  if (closedDate) {
    parts.push(`ปิดรับสมัครวันที่ ${closedDate}`);
  }

  return parts.join(" · ");
}

export interface AdmissionSyncResult {
  totalPrograms: number;
  totalCriteria: number;
  durationMs: number;
}

type CriteriaRow = [
  string, // academic_year
  string, // university
  string, // university_id
  string, // faculty
  string, // major
  string, // round
  string, // round_name
  number, // quota
  string, // gpax_min
  string, // score_breakdown (JSON)
  string, // details_json
  string, // criteria
  string, // source_url
  string, // source_label
  number, // source_is_custom
  string // verified_at
];

export async function runAdmissionSync(): Promise<AdmissionSyncResult> {
  const start = Date.now();
  const [courses, portalOverrides] = await Promise.all([fetchAllCourses(), fetchPortalOverrides()]);

  const verifiedAt = new Date().toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const rowLists = await mapWithConcurrency(courses, 24, async (course) => {
    const rounds = await fetchRoundsForProgram(course.program_id);
    const rows: CriteriaRow[] = [];

    const portalOverride = portalOverrides.find((p) => course.university_name_th.includes(p.keyword));

    for (const round of rounds) {
      if (!round.receive_student_number || round.receive_student_number <= 0) continue;

      const [roundNum, academicYear] = (round.type ?? "").split("_");
      if (!roundNum) continue;

      const badges = buildScoreBadges(round.scores);
      const minGpax = round.score_conditions?.min_gpax ?? round.min_gpax;
      const roundName = ROUND_NAMES[roundNum] ?? `รอบ ${roundNum}`;
      const closedDate = formatThaiDate(round.folio?.closed_date);

      const openInfo = ROUND_OPEN_INFO[roundNum];

      const details: CriteriaDetails = {
        description: isReadableThai(round.description),
        condition: isReadableThai(round.condition),
        openDateShort: openInfo?.short ?? null,
        openDateNote: openInfo?.note ?? null,
        closedDate,
        interviewDate: formatThaiDate(round.interview_date),
        interviewTime: round.interview_time?.trim() || null,
        interviewLocation: isReadableThai(round.interview_location),
        minGpaBreakdown: buildMinGpaBreakdown(round),
        physicalRequirements: buildPhysicalRequirements(round),
      };

      const sourceUrl = portalOverride?.url || round.link?.trim() || `https://course.mytcas.com/programs/${course.program_id}`;
      const sourceLabel = portalOverride?.label || "TCAS70 (mytcas.com)";

      rows.push([
        academicYear || "2570",
        course.university_name_th,
        course.university_id,
        course.faculty_name_th,
        `${course.program_name_th} (${course.program_type_name_th})`,
        roundNum,
        roundName,
        round.receive_student_number,
        typeof minGpax === "number" && minGpax > 0 ? minGpax.toFixed(2) : "ไม่ระบุ",
        JSON.stringify(badges),
        JSON.stringify(details),
        buildCriteriaSummary(badges, closedDate, openInfo?.short ?? null, roundName, round.receive_student_number),
        sourceUrl,
        sourceLabel,
        portalOverride ? 1 : 0,
        verifiedAt,
      ]);
    }

    return rows;
  });

  const rows = rowLists.flat();

  await pool.query("DELETE FROM admission_criteria");

  const columns =
    "(academic_year, university, university_id, faculty, major, round, round_name, quota, gpax_min, score_breakdown, details_json, criteria, source_url, source_label, source_is_custom, verified_at)";

  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const placeholders = chunk.map(() => "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").join(",");
    await pool.query(
      `INSERT INTO admission_criteria ${columns} VALUES ${placeholders}`,
      chunk.flat()
    );
  }

  await updateSettings({
    admission_synced_at: new Date().toISOString(),
    admission_synced_count: String(rows.length),
  });

  return {
    totalPrograms: courses.length,
    totalCriteria: rows.length,
    durationMs: Date.now() - start,
  };
}
