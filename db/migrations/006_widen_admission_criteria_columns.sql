USE nextbeyond;

-- ข้อมูลจริงจาก TCAS70 (mytcas.com) มีชื่อมหาวิทยาลัย/คณะ/หลักสูตรยาวกว่าที่คาดไว้เดิม
ALTER TABLE admission_criteria
  MODIFY COLUMN university VARCHAR(255) NOT NULL,
  MODIFY COLUMN faculty VARCHAR(255) NOT NULL,
  MODIFY COLUMN major VARCHAR(500) NOT NULL,
  MODIFY COLUMN source_label VARCHAR(255) NOT NULL;

ALTER TABLE admission_criteria
  MODIFY COLUMN source_url VARCHAR(1000) NOT NULL;

ALTER TABLE admission_criteria
  MODIFY COLUMN major TEXT NOT NULL;
