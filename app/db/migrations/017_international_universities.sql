-- มหาวิทยาลัยต่างประเทศ (สหรัฐอเมริกา, จีน ฯลฯ) — ข้อมูลพื้นฐานสำหรับให้นักเรียนดูเป็นข้อมูลประกอบการตัดสินใจ
-- ไม่ใช่ระบบ TCAS จึงไม่มีข้อมูลรอบรับสมัคร/GPAX เหมือน admission_criteria เพราะแต่ละมหาวิทยาลัยมีกำหนดการ
-- และเกณฑ์ของตัวเองที่ต่างกันมาก — admission_note เป็นข้อมูลทั่วไปของประเทศนั้นๆ ไม่ใช่เกณฑ์เฉพาะของแต่ละที่
CREATE TABLE IF NOT EXISTS international_universities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  country_th VARCHAR(100) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  qs_rank INT NOT NULL,
  qs_rank_display VARCHAR(10) NOT NULL,
  website_url VARCHAR(500) NOT NULL,
  admission_note TEXT,
  sort_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_country (country),
  KEY idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
