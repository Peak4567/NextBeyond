import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faGraduationCap,
  faBookOpen,
  faUserGroup,
  faNewspaper,
  faBolt,
  faImages,
  faComments,
  faCalendarDays,
  faListCheck,
  faBoxArchive,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

export interface ResourceField {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox" | "select" | "image";
  options?: { value: string; label: string }[];
}

export interface ResourceConfig {
  table: string;
  label: string;
  description: string;
  fields: ResourceField[];
  icon: IconDefinition;
  detailLinkBase?: string;
  detailLinkLabel?: string;
  syncAction?: {
    endpoint: string;
    label: string;
    confirmTitle: string;
    confirmText: string;
  };
}

const PORTFOLIO_COVER_OPTIONS = [
  { value: "from-blue-600 to-indigo-800", label: "น้ำเงิน-คราม" },
  { value: "from-[#005a9c] to-teal-700", label: "ฟ้า-เขียวอมฟ้า" },
  { value: "from-orange-500 to-[#e25a3a]", label: "ส้ม-แดงอิฐ" },
  { value: "from-amber-500 to-red-600", label: "เหลืองทอง-แดง" },
  { value: "from-purple-600 to-[#003b73]", label: "ม่วง-กรมท่า" },
  { value: "from-cyan-600 to-blue-900", label: "ฟ้าอมเขียว-น้ำเงินเข้ม" },
];

const NEWS_IMAGE_COLOR_OPTIONS = [
  { value: "from-blue-900 to-indigo-900", label: "น้ำเงินเข้ม-คราม" },
  { value: "from-emerald-800 to-teal-900", label: "เขียวมรกต-เขียวเข้ม" },
  { value: "from-orange-700 to-amber-900", label: "ส้มเข้ม-น้ำตาลทอง" },
  { value: "from-rose-800 to-pink-950", label: "แดงกุหลาบ-ชมพูเข้ม" },
];

export const ADMIN_RESOURCES: Record<string, ResourceConfig> = {
  admissions: {
    table: "admission_criteria",
    label: "เกณฑ์การรับสมัคร TCAS",
    description: "แสดงในส่วน \"ค้นหาเกณฑ์การรับสมัคร\" หน้าเตรียมพร้อม",
    icon: faGraduationCap,
    syncAction: {
      endpoint: "/api/admin/admissions/sync",
      label: "ซิงค์ข้อมูลจาก TCAS70 ทั้งหมด",
      confirmTitle: "ยืนยันการซิงค์ข้อมูลจาก TCAS70?",
      confirmText:
        "ระบบจะดึงข้อมูลหลักสูตรทุกคณะทุกสาขาจากเว็บไซต์ TCAS70 จริง (mytcas.com) และแทนที่ข้อมูลเดิมทั้งหมด อาจใช้เวลา 1-2 นาที",
    },
    fields: [
      { key: "academic_year", label: "ปีการศึกษา (เช่น 2570)" },
      { key: "university", label: "มหาวิทยาลัย" },
      { key: "faculty", label: "คณะ" },
      { key: "major", label: "สาขา/หลักสูตร" },
      { key: "round", label: "รอบ (ตัวเลข เช่น 4)" },
      { key: "round_name", label: "ชื่อรอบ (เช่น รอบ 4 Direct Admission)" },
      { key: "quota", label: "จำนวนรับ", type: "number" },
      { key: "gpax_min", label: "GPAX ขั้นต่ำ" },
      { key: "criteria", label: "เกณฑ์การคัดเลือก", type: "textarea" },
      { key: "source_url", label: "ลิงก์ประกาศต้นทาง" },
      { key: "source_label", label: "ชื่อแหล่งที่มา" },
      { key: "pdf_url", label: "ลิงก์ไฟล์ PDF ประกาศรับสมัคร (ถ้ามี — เว้นว่างถ้ายังไม่มี)" },
      { key: "verified_at", label: "ตรวจสอบล่าสุดเมื่อ (เช่น 29 ก.ค. 2570)" },
    ],
  },
  courses: {
    table: "courses",
    label: "หลักสูตร/คณะ",
    description: "แสดงในส่วน \"กลุ่มสาขายอดนิยม\" หน้าแรก",
    icon: faBookOpen,
    fields: [
      { key: "title", label: "ชื่อหลักสูตร" },
      { key: "university", label: "มหาวิทยาลัย" },
      { key: "quota", label: "จำนวนรับ" },
      { key: "criteria", label: "เกณฑ์การคัดเลือก" },
      { key: "qualification", label: "คุณสมบัติผู้สมัคร", type: "textarea" },
    ],
  },
  team: {
    table: "team_members",
    label: "ทีมผู้พัฒนา",
    description: "แสดงในส่วน \"ผู้พัฒนา NextBeyond\" หน้าแรก",
    icon: faUserGroup,
    fields: [
      { key: "name", label: "ชื่อ" },
      { key: "role", label: "ตำแหน่ง" },
      { key: "image", label: "รูปภาพ", type: "image" },
    ],
  },
  news: {
    table: "news_articles",
    label: "ข่าวสารหลัก",
    description: "บทความข่าวในหน้าข่าวสาร",
    icon: faNewspaper,
    detailLinkBase: "/admin/news",
    detailLinkLabel: "แก้ไขเนื้อหาข่าว",
    fields: [
      { key: "title", label: "หัวข้อข่าว" },
      { key: "excerpt", label: "เนื้อหาย่อ", type: "textarea" },
      { key: "category", label: "หมวดหมู่" },
      { key: "article_date", label: "วันที่ (เช่น 28 ก.ค. 2026)" },
      { key: "read_time", label: "เวลาอ่าน (เช่น 4 นาที)" },
      { key: "author", label: "ผู้เขียน" },
      { key: "image_color", label: "โทนสีภาพปก (การ์ด)", type: "select", options: NEWS_IMAGE_COLOR_OPTIONS },
      { key: "cover_image", label: "ภาพหน้าปกข่าว (ไม่บังคับ)", type: "image" },
    ],
  },
  news_hot: {
    table: "news_hot_topics",
    label: "ข่าวด่วน",
    description: "รายการ \"เกาะติดข่าวด่วน\" หน้าข่าวสาร",
    icon: faBolt,
    fields: [
      { key: "title", label: "หัวข้อ" },
      { key: "time_label", label: "เวลา (เช่น 10 นาทีที่แล้ว)" },
      {
        key: "tag",
        label: "แท็ก",
        type: "select",
        options: [
          { value: "HOT", label: "HOT" },
          { value: "NEW", label: "NEW" },
          { value: "UPDATE", label: "UPDATE" },
        ],
      },
    ],
  },
  portfolios: {
    table: "portfolios",
    label: "พอร์ตโฟลิโอ",
    description: "ผลงานในหน้าชุมชนนักเรียน",
    icon: faImages,
    fields: [
      { key: "title", label: "ชื่อผลงาน" },
      { key: "student_name", label: "ชื่อนักเรียน" },
      { key: "school", label: "โรงเรียน" },
      { key: "faculty", label: "คณะ" },
      { key: "university", label: "มหาวิทยาลัย" },
      { key: "views", label: "ยอดวิว (เช่น 2.4k)" },
      { key: "likes", label: "ยอดไลก์", type: "number" },
      { key: "page_count", label: "จำนวนหน้า", type: "number" },
      { key: "tags", label: "แท็ก (คั่นด้วย , )" },
      { key: "cover_bg", label: "โทนสีภาพปก (ใช้เมื่อไม่มีรูปจริง)", type: "select", options: PORTFOLIO_COVER_OPTIONS },
      { key: "cover_image", label: "ภาพหน้าปก (ไม่บังคับ)", type: "image" },
    ],
  },
  discussions: {
    table: "community_discussions",
    label: "กระทู้พูดคุย",
    description: "กระทู้ในหน้าชุมชนนักเรียน",
    icon: faComments,
    fields: [
      { key: "title", label: "หัวข้อกระทู้" },
      { key: "author", label: "ผู้ตั้งกระทู้" },
      { key: "replies", label: "จำนวนตอบ", type: "number" },
      { key: "time_label", label: "เวลา (เช่น 10 นาทีที่แล้ว)" },
    ],
  },
  dates: {
    table: "important_dates",
    label: "วันสำคัญ",
    description: "รายการ \"วันสำคัญที่ต้องจำ\" หน้าเตรียมพร้อม",
    icon: faCalendarDays,
    fields: [
      { key: "day_label", label: "วันที่ (ตัวเลข เช่น 28)" },
      { key: "month_label", label: "เดือน (เช่น ต.ค.)" },
      { key: "title", label: "หัวข้อ" },
      { key: "description", label: "รายละเอียด" },
    ],
  },
  checklist: {
    table: "checklist_items",
    label: "Checklist เอกสาร",
    description: "รายการเอกสารในหน้าเตรียมพร้อม",
    icon: faListCheck,
    fields: [
      { key: "name", label: "รายการ" },
      { key: "is_default_done", label: "ทำเสร็จแล้วโดยค่าเริ่มต้น", type: "checkbox" },
    ],
  },
  exam_bank: {
    table: "exam_bank_items",
    label: "คลังข้อสอบ",
    description: "คลังข้อสอบเก่าจำลอง หน้าเตรียมพร้อม",
    icon: faBoxArchive,
    fields: [
      { key: "code", label: "รหัสวิชา (เช่น TGAT)" },
      { key: "title", label: "ชื่อชุดข้อสอบ" },
      { key: "meta", label: "รายละเอียด (เช่น ชุดปี 67 • 60 ข้อ • 60 นาที)" },
      {
        key: "color",
        label: "สี",
        type: "select",
        options: [
          { value: "blue", label: "ฟ้า" },
          { value: "orange", label: "ส้ม" },
        ],
      },
    ],
  },
  portal_overrides: {
    table: "university_portal_overrides",
    label: "ระบบรับสมัครเฉพาะของมหาวิทยาลัย",
    description:
      "ลิงก์ระบบสมัครเฉพาะของแต่ละมหาวิทยาลัย (เช่น iFolio ของ สจล.) ใช้แทนลิงก์ทั่วไปจาก TCAS เมื่อชื่อมหาวิทยาลัยตรงกับคำค้นหา — ใส่เฉพาะลิงก์ที่ตรวจสอบแล้วว่าถูกต้องจริงเท่านั้น",
    icon: faLink,
    fields: [
      { key: "university_keyword", label: "คำค้นหาในชื่อมหาวิทยาลัย (เช่น พระจอมเกล้าเจ้าคุณทหารลาดกระบัง)" },
      { key: "portal_label", label: "ชื่อระบบ (เช่น iFolio (สจล.))" },
      { key: "portal_url", label: "ลิงก์ระบบ (ตรวจสอบแล้วเท่านั้น)" },
      { key: "notes", label: "หมายเหตุ (ไม่บังคับ)", type: "textarea" },
    ],
  },
};

export type AdminResourceKey = keyof typeof ADMIN_RESOURCES;
