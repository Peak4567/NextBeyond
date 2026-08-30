-- เกณฑ์การรับสมัครจริงของมหาวิทยาลัยต่างประเทศแต่ละแห่ง (แปลสรุปเป็นไทย) ดึงจากเว็บแอดมิชชันทางการของแต่ละที่
-- เก็บแยกจากข้อมูลพื้นฐานใน international_universities เพราะบางแห่งอาจยังไม่มีข้อมูล (เว็บเข้าไม่ได้/ไม่พบข้อมูลระบุชัด)
ALTER TABLE international_universities
  ADD COLUMN documents_required TEXT NULL AFTER admission_note,
  ADD COLUMN test_policy TEXT NULL AFTER documents_required,
  ADD COLUMN deadlines TEXT NULL AFTER test_policy,
  ADD COLUMN application_fee VARCHAR(100) NULL AFTER deadlines,
  ADD COLUMN criteria_source_url VARCHAR(500) NULL AFTER application_fee,
  ADD COLUMN criteria_verified_at DATE NULL AFTER criteria_source_url;
