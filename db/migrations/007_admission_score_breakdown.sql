USE nextbeyond;

-- เก็บสัดส่วนคะแนนที่ใช้จริงต่อรอบ (GPAX/TGAT/TPAT/A-Level ฯลฯ) เป็น JSON
-- เพื่อแสดงเป็น badge สรุปให้อ่านง่าย ไม่ต้องอ่านข้อความยาว
ALTER TABLE admission_criteria
  ADD COLUMN score_breakdown TEXT NULL AFTER gpax_min;
