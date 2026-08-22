import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faRobot,
  faLaptopCode,
  faStethoscope,
  faTooth,
  faPrescriptionBottleMedical,
  faBriefcase,
  faVideo,
  faDraftingCompass,
  faFlask,
  faChartLine,
  faScaleBalanced,
  faLandmark,
  faPalette,
  faPlaneDeparture,
  faSeedling,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

interface CourseIconMatch {
  key: string;
  keywords: string[];
  icon: IconDefinition;
  colorClass: string;
  images: string[];
}

const TECH_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=75",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=75",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&q=75",
];
const MEDICAL_IMAGE = "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=900&q=75";
const DENTAL_IMAGE = "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=900&q=75";
const PHARMACY_IMAGE = "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=900&q=75";
const BUSINESS_IMAGE = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=75";
const ARCHITECTURE_IMAGE = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=75";
const CAMPUS_IMAGE = "https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=75";

// เรียงจากเฉพาะเจาะจงไปทั่วไป — คำที่เฉพาะกว่าต้องเช็กก่อนคำที่กว้างกว่า
// (เช่น "ทันตแพทย์/เภสัช" ต้องเช็กก่อน "แพทย" เพราะมีคำว่า "แพทย" ซ้อนอยู่ข้างใน)
const MATCHERS: CourseIconMatch[] = [
  { key: "ai", keywords: ["ปัญญาประดิษฐ์", "หุ่นยนต์", "AI", "robot"], icon: faRobot, colorClass: "from-violet-500 to-purple-600", images: TECH_IMAGES },
  { key: "dental", keywords: ["ทันตแพทย", "ทันตะ"], icon: faTooth, colorClass: "from-cyan-500 to-teal-600", images: [DENTAL_IMAGE] },
  { key: "pharmacy", keywords: ["เภสัช"], icon: faPrescriptionBottleMedical, colorClass: "from-emerald-500 to-green-700", images: [PHARMACY_IMAGE] },
  { key: "medical", keywords: ["แพทย", "พยาบาล", "สาธารณสุข"], icon: faStethoscope, colorClass: "from-rose-500 to-red-600", images: [MEDICAL_IMAGE] },
  { key: "tech", keywords: ["คอมพิวเตอร์", "ซอฟต์แวร์", "สารสนเทศ", "ไอที", "software", "it "], icon: faLaptopCode, colorClass: "from-blue-500 to-indigo-600", images: TECH_IMAGES },
  { key: "data", keywords: ["ข้อมูล", "data", "สถิติ"], icon: faChartLine, colorClass: "from-cyan-500 to-blue-600", images: TECH_IMAGES },
  { key: "business", keywords: ["บริหารธุรกิจ", "บัญชี", "การจัดการ", "การตลาด", "เศรษฐศาสตร์"], icon: faBriefcase, colorClass: "from-amber-500 to-orange-600", images: [BUSINESS_IMAGE] },
  { key: "media", keywords: ["นิเทศศาสตร์", "สื่อสารมวลชน", "วารสาร"], icon: faVideo, colorClass: "from-pink-500 to-rose-600", images: [BUSINESS_IMAGE] },
  { key: "architecture", keywords: ["สถาปัตยกรรม", "ออกแบบ"], icon: faDraftingCompass, colorClass: "from-teal-500 to-emerald-600", images: [ARCHITECTURE_IMAGE] },
  { key: "arts", keywords: ["ศิลปกรรม", "วิจิตรศิลป์", "ดุริยางค"], icon: faPalette, colorClass: "from-fuchsia-500 to-pink-600", images: [CAMPUS_IMAGE] },
  { key: "law", keywords: ["นิติศาสตร์", "กฎหมาย"], icon: faScaleBalanced, colorClass: "from-slate-500 to-gray-600", images: [CAMPUS_IMAGE] },
  { key: "government", keywords: ["รัฐศาสตร์", "รัฐประศาสน"], icon: faLandmark, colorClass: "from-indigo-500 to-blue-700", images: [CAMPUS_IMAGE] },
  { key: "aviation", keywords: ["การบิน", "อากาศยาน"], icon: faPlaneDeparture, colorClass: "from-sky-500 to-blue-600", images: [CAMPUS_IMAGE] },
  { key: "agriculture", keywords: ["เกษตร", "สัตวแพทย์", "ประมง"], icon: faSeedling, colorClass: "from-lime-500 to-green-600", images: [CAMPUS_IMAGE] },
  { key: "engineering", keywords: ["วิศวกรรม", "engineering"], icon: faLaptopCode, colorClass: "from-blue-500 to-indigo-600", images: TECH_IMAGES },
  { key: "science", keywords: ["วิทยาศาสตร์", "science"], icon: faFlask, colorClass: "from-emerald-500 to-teal-600", images: TECH_IMAGES },
];

const DEFAULT_VISUAL: CourseIconMatch = {
  key: "default",
  keywords: [],
  icon: faGraduationCap,
  colorClass: "from-[#005a9c] to-[#003b73]",
  images: [CAMPUS_IMAGE],
};

function matchCourse(title: string): CourseIconMatch {
  const lower = title.toLowerCase();
  for (const matcher of MATCHERS) {
    if (matcher.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return matcher;
    }
  }
  return DEFAULT_VISUAL;
}

export function getCourseIcon(title: string): { icon: IconDefinition; colorClass: string; image: string } {
  const match = matchCourse(title);
  return { icon: match.icon, colorClass: match.colorClass, image: match.images[0] };
}

// ใช้กับลิสต์หลายรายการพร้อมกัน (เช่น การ์ดในหน้าแรก) — นับจำนวนครั้งที่เจอหมวดเดียวกัน
// แล้วเลือกภาพหมุนเวียนภายในหมวดนั้น ป้องกันไม่ให้การ์ดที่อยู่หมวดเดียวกันใช้ภาพซ้ำกัน
export function getCourseVisualsForList<T extends { title: string }>(
  items: T[]
): { icon: IconDefinition; colorClass: string; image: string }[] {
  const seenCount: Record<string, number> = {};
  return items.map((item) => {
    const match = matchCourse(item.title);
    const count = seenCount[match.key] ?? 0;
    seenCount[match.key] = count + 1;
    const image = match.images[count % match.images.length];
    return { icon: match.icon, colorClass: match.colorClass, image };
  });
}
