-- แขนงวิชา/โครงการย่อยภายในหลักสูตรเดียวกัน (ถ้ามี) เช่น หลักสูตรอักษรศาสตรบัณฑิต
-- มีหลายแขนงวิชา: ภาษาไทย, ภาษาอังกฤษ, ประวัติศาสตร์ ฯลฯ ที่รับสมัครแยกโควตากันจริง
-- ข้อมูลนี้มาจากฟิลด์ major_name_th ของ mytcas.com (แยกจาก program_name_th ซึ่งเป็นชื่อหลักสูตรรวม)
ALTER TABLE admission_criteria
  ADD COLUMN concentration VARCHAR(500) NULL AFTER major;
