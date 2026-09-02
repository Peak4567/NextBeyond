USE nextbeyond;

-- เก็บรายละเอียดรอบสมัครแบบมีโครงสร้าง (คำอธิบายหลักสูตร เงื่อนไข กำหนดการสัมภาษณ์ วันปิดรับสมัคร)
-- เพื่อให้เว็บเขียนสรุปเองและแสดงใน Modal โดยไม่ต้องพึ่งข้อความจากภายนอก
ALTER TABLE admission_criteria
  ADD COLUMN details_json TEXT NULL AFTER score_breakdown;
