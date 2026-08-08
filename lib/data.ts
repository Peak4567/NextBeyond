import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export interface AdmissionCriteria extends RowDataPacket {
  id: number;
  academicYear: string;
  university: string;
  faculty: string;
  major: string;
  round: string;
  roundName: string;
  quota: number;
  gpaxMin: string;
  criteria: string;
  sourceUrl: string;
  sourceLabel: string;
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
  limit?: number;
}

export async function getAdmissionCriteria(params: AdmissionCriteriaQuery = {}) {
  const { q, round, limit = 50 } = params;

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

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM admission_criteria ${whereClause}`,
    values
  );
  const total = countRows[0]?.total ?? 0;

  const [rows] = await pool.query<AdmissionCriteria[]>(
    `SELECT id, academic_year AS academicYear, university, faculty, major, round,
            round_name AS roundName, quota, gpax_min AS gpaxMin, criteria,
            source_url AS sourceUrl, source_label AS sourceLabel, verified_at AS verifiedAt
     FROM admission_criteria ${whereClause} ORDER BY sort_order, id LIMIT ?`,
    [...values, limit]
  );

  return { items: rows, total };
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
