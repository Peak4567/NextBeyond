import { pool } from "@/lib/db";
import { updateSettings } from "@/lib/settings";

const TCAS_DATA_BASE = "https://my-tcas.s3.ap-southeast-1.amazonaws.com/mytcas";

const ROUND_NAMES: Record<string, string> = {
  "1": "รอบ 1 Portfolio",
  "2": "รอบ 2 Quota",
  "3": "รอบ 3 Admission",
  "4": "รอบ 4 Direct Admission",
};

interface TcasCourse {
  program_id: string;
  university_name_th: string;
  faculty_name_th: string;
  program_name_th: string;
  program_type_name_th: string;
}

interface TcasRound {
  type: string;
  receive_student_number: number;
  link: string;
  updated_at?: string;
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

export interface AdmissionSyncResult {
  totalPrograms: number;
  totalCriteria: number;
  durationMs: number;
}

type CriteriaRow = [
  string, // academic_year
  string, // university
  string, // faculty
  string, // major
  string, // round
  string, // round_name
  number, // quota
  string, // gpax_min
  string, // criteria
  string, // source_url
  string, // source_label
  string // verified_at
];

export async function runAdmissionSync(): Promise<AdmissionSyncResult> {
  const start = Date.now();
  const courses = await fetchAllCourses();

  const verifiedAt = new Date().toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const rowLists = await mapWithConcurrency(courses, 24, async (course) => {
    const rounds = await fetchRoundsForProgram(course.program_id);
    const rows: CriteriaRow[] = [];

    for (const round of rounds) {
      if (!round.receive_student_number || round.receive_student_number <= 0) continue;

      const [roundNum, academicYear] = (round.type ?? "").split("_");
      if (!roundNum) continue;

      rows.push([
        academicYear || "2570",
        course.university_name_th,
        course.faculty_name_th,
        `${course.program_name_th} (${course.program_type_name_th})`,
        roundNum,
        ROUND_NAMES[roundNum] ?? `รอบ ${roundNum}`,
        round.receive_student_number,
        "ไม่ระบุ",
        "ดูรายละเอียดเกณฑ์การคัดเลือกฉบับเต็มได้ที่ประกาศต้นทางของมหาวิทยาลัย",
        round.link?.trim() || `https://course.mytcas.com/programs/${course.program_id}`,
        "TCAS70 (mytcas.com)",
        verifiedAt,
      ]);
    }

    return rows;
  });

  const rows = rowLists.flat();

  await pool.query("DELETE FROM admission_criteria");

  const columns =
    "(academic_year, university, faculty, major, round, round_name, quota, gpax_min, criteria, source_url, source_label, verified_at)";

  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const placeholders = chunk.map(() => "(?,?,?,?,?,?,?,?,?,?,?,?)").join(",");
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
