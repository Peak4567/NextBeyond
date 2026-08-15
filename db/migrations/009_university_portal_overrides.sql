USE nextbeyond;

-- บางมหาวิทยาลัยรับสมัครผ่านระบบของตัวเอง (ไม่ใช่ลิงก์ทั่วไปจาก TCAS)
-- เช่น สจล. ใช้ iFolio โดยเฉพาะสำหรับรอบ Portfolio
-- ตารางนี้ให้แอดมินเพิ่ม/แก้ไขลิงก์เฉพาะเหล่านี้เอง เพื่อความถูกต้อง (ไม่เดาลิงก์)
CREATE TABLE IF NOT EXISTS university_portal_overrides (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  university_keyword VARCHAR(255) NOT NULL,
  portal_label VARCHAR(150) NOT NULL,
  portal_url VARCHAR(500) NOT NULL,
  notes VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO university_portal_overrides (university_keyword, portal_label, portal_url, notes, sort_order) VALUES
('พระจอมเกล้าเจ้าคุณทหารลาดกระบัง', 'iFolio (สจล.)', 'https://ifolio.kmitl.ac.th', 'ระบบแฟ้มสะสมผลงานออนไลน์เฉพาะของ สจล. สำหรับ TCAS รอบ 1 Portfolio', 1);

ALTER TABLE admission_criteria
  ADD COLUMN source_is_custom TINYINT(1) NOT NULL DEFAULT 0 AFTER source_label;
