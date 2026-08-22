export interface HolidayEvent {
  month: number; // 1-12
  day: number;
  name: string;
}

// วันหยุดราชการไทยที่มีวันที่แน่นอนตายตัวทุกปี (อิงปฏิทินสุริยคติ)
// ไม่รวมวันหยุดที่คำนวณจากปฏิทินจันทรคติ (มาฆบูชา/วิสาขบูชา/อาสาฬหบูชา/วันเข้าพรรษา)
// เพราะวันที่เปลี่ยนทุกปีตามจันทรคติ ต้องตรวจสอบจากราชกิจจานุเบกษาหรือปฏิทินราชการประจำปีเท่านั้น
export const FIXED_THAI_HOLIDAYS: HolidayEvent[] = [
  { month: 1, day: 1, name: "วันขึ้นปีใหม่" },
  { month: 4, day: 6, name: "วันจักรี" },
  { month: 4, day: 13, name: "วันสงกรานต์" },
  { month: 4, day: 14, name: "วันสงกรานต์" },
  { month: 4, day: 15, name: "วันสงกรานต์" },
  { month: 5, day: 1, name: "วันแรงงานแห่งชาติ" },
  { month: 5, day: 4, name: "วันฉัตรมงคล" },
  { month: 6, day: 3, name: "วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี" },
  { month: 7, day: 28, name: "วันเฉลิมพระชนมพรรษา ร.10" },
  { month: 8, day: 12, name: "วันแม่แห่งชาติ" },
  { month: 10, day: 13, name: "วันคล้ายวันสวรรคต ร.9" },
  { month: 10, day: 23, name: "วันปิยมหาราช" },
  { month: 12, day: 5, name: "วันพ่อแห่งชาติ" },
  { month: 12, day: 10, name: "วันรัฐธรรมนูญ" },
  { month: 12, day: 31, name: "วันสิ้นปี" },
];

export const LUNAR_HOLIDAY_NOTE =
  "วันหยุดราชการที่คำนวณจากปฏิทินจันทรคติ (มาฆบูชา, วิสาขบูชา, อาสาฬหบูชา, วันเข้าพรรษา) ไม่ได้แสดงในปฏิทินนี้ เนื่องจากวันที่เปลี่ยนทุกปี โปรดตรวจสอบวันที่แน่นอนจากราชกิจจานุเบกษาหรือปฏิทินราชการประจำปี";

export function getHolidaysForMonth(year: number, month: number): HolidayEvent[] {
  return FIXED_THAI_HOLIDAYS.filter((h) => h.month === month).map((h) => ({ ...h }));
}
