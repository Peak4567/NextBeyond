-- แยกแฟล็กสำหรับแถวที่แอดมิน/ระบบเพิ่มเข้ามาด้วยมือจากเว็บมหาวิทยาลัยจริง (ไม่ได้มาจาก mytcas.com sync)
-- เช่น มหาวิทยาลัยเกษตรศาสตร์ที่ไม่มีอยู่ใน mytcas.com เลย — ต้องกันไม่ให้ถูกลบทิ้งตอนซิงก์ TCAS ใหม่ทั้งระบบ
ALTER TABLE admission_criteria
  ADD COLUMN is_manual TINYINT(1) NOT NULL DEFAULT 0 AFTER source_is_custom;
