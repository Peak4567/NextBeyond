USE nextbeyond;

-- university_id ใช้สร้างลิงก์โลโก้จริงจาก assets.mytcas.com/i/logo/{id}.png
-- และใช้เป็น slug สำหรับหน้าเลือกมหาวิทยาลัยแยกรายมหาวิทยาลัย
ALTER TABLE admission_criteria
  ADD COLUMN university_id VARCHAR(20) NULL AFTER university;
