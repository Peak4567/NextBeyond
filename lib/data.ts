import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export interface AdmissionCriteria extends RowDataPacket {
  id: number;
  academicYear: string;
  university: string;
  universityId: string | null;
  faculty: string;
  major: string;
  round: string;
  roundName: string;
  quota: number;
  gpaxMin: string;
  scoreBreakdown: string | null;
  detailsJson: string | null;
  criteria: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceIsCustom: number;
  verifiedAt: string;
}

export interface Course extends RowDataPacket {
  id: number;
  title: string;
  university: string;
  quota: string;
  criteria: string;
  qualification: string;
}

export interface TeamMember extends RowDataPacket {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface NewsArticle extends RowDataPacket {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  article_date: string;
  read_time: string;
  author: string;
  image_color: string;
  cover_image: string | null;
}

export interface NewsBlock extends RowDataPacket {
  id: number;
  block_type: "text" | "image";
  text_content: string | null;
  image_path: string | null;
  is_bold: number;
  is_italic: number;
  sort_order: number;
}

export interface NewsHotTopic extends RowDataPacket {
  id: number;
  title: string;
  time_label: string;
  tag: string;
}

export interface Portfolio extends RowDataPacket {
  id: number;
  title: string;
  student_name: string;
  school: string;
  faculty: string;
  university: string;
  views: string;
  likes: number;
  page_count: number;
  tags: string;
  cover_bg: string;
  cover_image: string | null;
}

export interface PortfolioImage extends RowDataPacket {
  id: number;
  image_path: string;
}

export interface PortfolioComment extends RowDataPacket {
  id: number;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface CommunityDiscussion extends RowDataPacket {
  id: number;
  title: string;
  author: string;
  replies: number;
  time_label: string;
}

export interface ImportantDate extends RowDataPacket {
  id: number;
  day_label: string;
  month_label: string;
  title: string;
  description: string;
}

export interface ChecklistItem extends RowDataPacket {
  id: number;
  name: string;
  is_default_done: number;
}

export interface ExamBankItem extends RowDataPacket {
  id: number;
  code: string;
  title: string;
  meta: string;
  color: string;
}

export interface AdmissionCriteriaQuery {
  q?: string;
  round?: string;
  universityId?: string;
  limit?: number;
}

export async function getAdmissionCriteria(params: AdmissionCriteriaQuery = {}) {
  const { q, round, universityId, limit = 50 } = params;

  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (q) {
    conditions.push("(university LIKE ? OR faculty LIKE ? OR major LIKE ?)");
    const like = `%${q}%`;
    values.push(like, like, like);
  }
  if (round) {
    conditions.push("round = ?");
    values.push(round);
  }
  if (universityId) {
    conditions.push("university_id = ?");
    values.push(universityId);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM admission_criteria ${whereClause}`,
    values
  );
  const total = countRows[0]?.total ?? 0;

  const [rows] = await pool.query<AdmissionCriteria[]>(
    `SELECT id, academic_year AS academicYear, university, university_id AS universityId, faculty, major, round,
            round_name AS roundName, quota, gpax_min AS gpaxMin, score_breakdown AS scoreBreakdown,
            details_json AS detailsJson, criteria,
            source_url AS sourceUrl, source_label AS sourceLabel, source_is_custom AS sourceIsCustom,
            verified_at AS verifiedAt
     FROM admission_criteria ${whereClause} ORDER BY university, quota DESC LIMIT ?`,
    [...values, limit]
  );

  return { items: rows, total };
}

export interface UniversitySummary extends RowDataPacket {
  universityId: string | null;
  university: string;
  programCount: number;
}

// ข้อมูลต้นทางจาก mytcas.com บางรายการสะกดชื่อมหาวิทยาลัยไม่ตรงกันเล็กน้อยสำหรับ university_id เดียวกัน
// (เช่น พิมพ์ผิด 2-3 รายการจากทั้งหมดเป็นร้อย) ถ้า GROUP BY (id, ชื่อ) ตรงๆ จะได้ id ซ้ำสองแถว
// ทำให้ React key ชนกัน จึงต้อง group ตาม id อย่างเดียว แล้วเลือกชื่อที่พบบ่อยที่สุดมาแสดงแทน
export async function getUniversitiesList() {
  const [rows] = await pool.query<UniversitySummary[]>(
    `SELECT ids.university_id AS universityId, names.university, ids.programCount
     FROM (
       SELECT university_id, COUNT(*) AS programCount
       FROM admission_criteria
       WHERE university_id IS NOT NULL
       GROUP BY university_id
     ) ids
     JOIN (
       SELECT university_id, university,
              ROW_NUMBER() OVER (PARTITION BY university_id ORDER BY COUNT(*) DESC) AS rn
       FROM admission_criteria
       WHERE university_id IS NOT NULL
       GROUP BY university_id, university
     ) names ON names.university_id = ids.university_id AND names.rn = 1
     ORDER BY names.university`
  );
  return rows;
}

export async function getUniversityInfo(universityId: string) {
  const [rows] = await pool.query<UniversitySummary[]>(
    `SELECT ids.university_id AS universityId, names.university, ids.programCount
     FROM (
       SELECT university_id, COUNT(*) AS programCount
       FROM admission_criteria
       WHERE university_id = ?
       GROUP BY university_id
     ) ids
     JOIN (
       SELECT university_id, university,
              ROW_NUMBER() OVER (PARTITION BY university_id ORDER BY COUNT(*) DESC) AS rn
       FROM admission_criteria
       WHERE university_id = ?
       GROUP BY university_id, university
     ) names ON names.university_id = ids.university_id AND names.rn = 1
     LIMIT 1`,
    [universityId, universityId]
  );
  return rows[0] ?? null;
}

export async function getCourses() {
  const [rows] = await pool.query<Course[]>(
    "SELECT id, title, university, quota, criteria, qualification FROM courses ORDER BY sort_order, id"
  );
  return rows;
}

export async function getTeamMembers() {
  const [rows] = await pool.query<TeamMember[]>(
    "SELECT id, name, role, image FROM team_members ORDER BY sort_order, id"
  );
  return rows;
}

export async function getNewsArticles() {
  const [rows] = await pool.query<NewsArticle[]>(
    "SELECT id, title, excerpt, category, article_date, read_time, author, image_color, cover_image FROM news_articles ORDER BY sort_order, id"
  );
  return rows;
}

export async function getNewsArticleById(id: number) {
  const [rows] = await pool.query<NewsArticle[]>(
    "SELECT id, title, excerpt, category, article_date, read_time, author, image_color, cover_image FROM news_articles WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}

export async function getNewsBlocks(articleId: number) {
  const [rows] = await pool.query<NewsBlock[]>(
    "SELECT id, block_type, text_content, image_path, is_bold, is_italic, sort_order FROM news_blocks WHERE news_article_id = ? ORDER BY sort_order, id",
    [articleId]
  );
  return rows;
}

export async function getNewsHotTopics() {
  const [rows] = await pool.query<NewsHotTopic[]>(
    "SELECT id, title, time_label, tag FROM news_hot_topics ORDER BY sort_order, id"
  );
  return rows;
}

export async function getPortfolios() {
  const [rows] = await pool.query<Portfolio[]>(
    `SELECT id, title, student_name, school, faculty, university, views, likes, page_count, tags, cover_bg, cover_image
     FROM portfolios WHERE status = 'approved' ORDER BY sort_order, id`
  );
  return rows;
}

export async function getPortfolioById(id: number) {
  const [rows] = await pool.query<Portfolio[]>(
    `SELECT id, title, student_name, school, faculty, university, views, likes, page_count, tags, cover_bg, cover_image
     FROM portfolios WHERE id = ? AND status = 'approved'`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getPortfolioImages(portfolioId: number) {
  const [rows] = await pool.query<PortfolioImage[]>(
    "SELECT id, image_path FROM portfolio_images WHERE portfolio_id = ? ORDER BY sort_order, id",
    [portfolioId]
  );
  return rows;
}

export async function getPortfolioComments(portfolioId: number) {
  const [rows] = await pool.query<PortfolioComment[]>(
    `SELECT c.id, c.content, c.created_at AS createdAt, u.full_name AS authorName
     FROM portfolio_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.portfolio_id = ?
     ORDER BY c.created_at DESC`,
    [portfolioId]
  );
  return rows;
}

export async function getCommunityDiscussions() {
  const [rows] = await pool.query<CommunityDiscussion[]>(
    "SELECT id, title, author, replies, time_label FROM community_discussions ORDER BY sort_order, id"
  );
  return rows;
}

export async function getImportantDates() {
  const [rows] = await pool.query<ImportantDate[]>(
    "SELECT id, day_label, month_label, title, description FROM important_dates ORDER BY sort_order, id"
  );
  return rows;
}

export async function getChecklistItems() {
  const [rows] = await pool.query<ChecklistItem[]>(
    "SELECT id, name, is_default_done FROM checklist_items ORDER BY sort_order, id"
  );
  return rows;
}

export async function getExamBankItems() {
  const [rows] = await pool.query<ExamBankItem[]>(
    "SELECT id, code, title, meta, color FROM exam_bank_items ORDER BY sort_order, id"
  );
  return rows;
}

export interface ExamCategory extends RowDataPacket {
  id: number;
  code: string;
  name: string;
  group_name: string;
  description: string | null;
  color: string;
}

export interface ExamSet extends RowDataPacket {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  duration_minutes: number;
  question_count: number;
}

export interface ExamQuestion extends RowDataPacket {
  id: number;
  exam_set_id: number;
  question_type: "mc" | "error_id" | "listening";
  passage_text: string | null;
  audio_path: string | null;
  question_text: string;
  choices: string[] | { segments: string[]; underlineIndexes: number[] };
  correct_index: number;
  explanation: string | null;
  sort_order: number;
}

export async function getExamCategories() {
  const [rows] = await pool.query<ExamCategory[]>(
    "SELECT id, code, name, group_name, description, color FROM exam_categories ORDER BY sort_order, id"
  );
  return rows;
}

export async function getExamCategoryByCode(code: string) {
  const [rows] = await pool.query<ExamCategory[]>(
    "SELECT id, code, name, group_name, description, color FROM exam_categories WHERE code = ?",
    [code]
  );
  return rows[0] ?? null;
}

export async function getExamSetsByCategory(categoryId: number) {
  const [rows] = await pool.query<ExamSet[]>(
    `SELECT s.id, s.category_id, s.title, s.description, s.duration_minutes,
            (SELECT COUNT(*) FROM exam_questions q WHERE q.exam_set_id = s.id) AS question_count
     FROM exam_sets s WHERE s.category_id = ? ORDER BY s.sort_order, s.id`,
    [categoryId]
  );
  return rows;
}

export async function getExamSetById(setId: number) {
  const [rows] = await pool.query<ExamSet[]>(
    `SELECT s.id, s.category_id, s.title, s.description, s.duration_minutes,
            (SELECT COUNT(*) FROM exam_questions q WHERE q.exam_set_id = s.id) AS question_count
     FROM exam_sets s WHERE s.id = ?`,
    [setId]
  );
  return rows[0] ?? null;
}

export async function getExamQuestions(examSetId: number) {
  const [rows] = await pool.query<ExamQuestion[]>(
    `SELECT id, exam_set_id, question_type, passage_text, audio_path, question_text, choices, correct_index, explanation, sort_order
     FROM exam_questions WHERE exam_set_id = ? ORDER BY sort_order, id`,
    [examSetId]
  );
  return rows;
}

export interface ExamAttempt extends RowDataPacket {
  id: number;
  exam_set_id: number;
  score: number;
  total: number;
  duration_seconds: number;
  created_at: string;
  set_title: string;
  category_name: string;
}

export async function getExamAttemptsForUser(userId: number) {
  const [rows] = await pool.query<ExamAttempt[]>(
    `SELECT a.id, a.exam_set_id, a.score, a.total, a.duration_seconds, a.created_at,
            s.title AS set_title, c.name AS category_name
     FROM exam_attempts a
     JOIN exam_sets s ON s.id = a.exam_set_id
     JOIN exam_categories c ON c.id = s.category_id
     WHERE a.user_id = ?
     ORDER BY a.created_at DESC`,
    [userId]
  );
  return rows;
}
