export interface OfficialAdmissionCriteria {
  id: string;
  academicYear: "2569";
  university: string;
  faculty: string;
  major: string;
  round: "4";
  roundName: string;
  quota: number;
  gpaxMin: string;
  criteria: string;
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
}

// ข้อมูลชุดนี้ถอดจากหน้าเกณฑ์ของมหาวิทยาลัยโดยตรง ไม่ใช่ข้อมูลตัวอย่าง
// อัปเดตข้อมูลใหม่โดยแก้ไขจากประกาศต้นทางและเปลี่ยน verifiedAt ทุกครั้ง
export const OFFICIAL_ADMISSION_CRITERIA: OfficialAdmissionCriteria[] = [
  {
    id: "ku69-chemistry-international",
    academicYear: "2569",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    faculty: "คณะวิทยาศาสตร์ (บางเขน)",
    major: "วท.บ. เคมีบูรณาการ (นานาชาติ)",
    round: "4",
    roundName: "รอบ 4 Direct Admission",
    quota: 5,
    gpaxMin: "2.50 (6 ภาคเรียน)",
    criteria: "GPAX 30% + สอบสัมภาษณ์ภาษาอังกฤษ 70%; ต้องมีผลภาษาอังกฤษตามที่โครงการกำหนด และ Portfolio ด้านวิทยาศาสตร์ไม่เกิน 10 หน้า",
    sourceUrl: "https://admission.ku.ac.th/majors/project/31/",
    sourceLabel: "เกณฑ์รับตรงอิสระ KU-TCAS69",
    verifiedAt: "29 ก.ค. 2569",
  },
  {
    id: "ku69-biochemistry",
    academicYear: "2569",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    faculty: "คณะวิทยาศาสตร์ (บางเขน)",
    major: "วท.บ. ชีวเคมี (ภาษาไทย ปกติ)",
    round: "4",
    roundName: "รอบ 4 Direct Admission",
    quota: 8,
    gpaxMin: "ไม่ระบุ",
    criteria: "TGAT 40% + TPAT3 40% + A-Level เคมี 10% + A-Level ชีววิทยา 10%; ต้องมีหน่วยกิตวิทย์ 22, คณิต 12 และภาษาต่างประเทศ 9 หน่วยกิตขึ้นไป",
    sourceUrl: "https://admission.ku.ac.th/majors/project/31/",
    sourceLabel: "เกณฑ์รับตรงอิสระ KU-TCAS69",
    verifiedAt: "29 ก.ค. 2569",
  },
  {
    id: "ku69-biological-science-technology",
    academicYear: "2569",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    faculty: "คณะวิทยาศาสตร์ (บางเขน)",
    major: "วท.บ. วิทยาศาสตร์ชีวภาพและเทคโนโลยี (นานาชาติ)",
    round: "4",
    roundName: "รอบ 4 Direct Admission",
    quota: 30,
    gpaxMin: "2.50 (6 ภาคเรียน)",
    criteria: "ผลการเรียน/วุฒิเทียบเท่า 80% + คะแนนภาษาอังกฤษหรือสัมภาษณ์ภาษาอังกฤษ 20%; ผู้สมัครต้องมี Portfolio และผลภาษาอังกฤษตามเกณฑ์โครงการ",
    sourceUrl: "https://admission.ku.ac.th/majors/project/31/",
    sourceLabel: "เกณฑ์รับตรงอิสระ KU-TCAS69",
    verifiedAt: "29 ก.ค. 2569",
  },
  {
    id: "ku69-nuclear-science",
    academicYear: "2569",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    faculty: "คณะวิทยาศาสตร์ (บางเขน)",
    major: "วท.บ. วิทยาศาสตร์นิวเคลียร์ (ภาษาไทย ปกติ)",
    round: "4",
    roundName: "รอบ 4 Direct Admission",
    quota: 5,
    gpaxMin: "ไม่ระบุ",
    criteria: "TGAT 30% + TPAT3 70%; ต้องมีหน่วยกิตคณิตศาสตร์ 12 หน่วยกิต และวิทยาศาสตร์ 22 หน่วยกิตขึ้นไป",
    sourceUrl: "https://admission.ku.ac.th/majors/project/31/",
    sourceLabel: "เกณฑ์รับตรงอิสระ KU-TCAS69",
    verifiedAt: "29 ก.ค. 2569",
  },
  {
    id: "ku69-environmental-engineering",
    academicYear: "2569",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    faculty: "คณะวิศวกรรมศาสตร์ (บางเขน)",
    major: "วศ.บ. วิศวกรรมสิ่งแวดล้อม (นานาชาติ)",
    round: "4",
    roundName: "รอบ 4 Direct Admission",
    quota: 5,
    gpaxMin: "ไม่ระบุ",
    criteria: "TGAT1 25% + TPAT3 25% + A-Level คณิต 1 25% + A-Level ฟิสิกส์ 25%; มีการสัมภาษณ์เป็นภาษาอังกฤษ",
    sourceUrl: "https://admission.ku.ac.th/majors/project/31/",
    sourceLabel: "เกณฑ์รับตรงอิสระ KU-TCAS69",
    verifiedAt: "29 ก.ค. 2569",
  },
];
