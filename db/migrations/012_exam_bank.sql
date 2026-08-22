-- คลังข้อสอบฝึกทำ: หมวดข้อสอบ, ชุดข้อสอบ, คำถาม, และประวัติการทำข้อสอบของผู้ใช้
-- หมายเหตุ: คำถามทั้งหมดเป็นข้อสอบจำลองที่แต่งขึ้นเองในสไตล์เดียวกับข้อสอบจริง
-- ไม่ใช่ข้อสอบจริงของ สทศ./ทปอ./British Council/ETS/จุฬาฯ เนื่องจากข้อสอบจริงมีลิขสิทธิ์

CREATE TABLE IF NOT EXISTS exam_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  group_name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  color VARCHAR(100) NOT NULL DEFAULT 'from-blue-500 to-indigo-600',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exam_sets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exam_sets_category FOREIGN KEY (category_id) REFERENCES exam_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exam_questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_set_id INT UNSIGNED NOT NULL,
  question_type ENUM('mc', 'error_id', 'listening') NOT NULL DEFAULT 'mc',
  passage_text TEXT NULL,
  audio_path VARCHAR(255) NULL,
  question_text TEXT NOT NULL,
  choices JSON NOT NULL,
  correct_index TINYINT UNSIGNED NOT NULL,
  explanation TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exam_questions_set FOREIGN KEY (exam_set_id) REFERENCES exam_sets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exam_attempts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  exam_set_id INT UNSIGNED NOT NULL,
  answers JSON NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  duration_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exam_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_exam_attempts_set FOREIGN KEY (exam_set_id) REFERENCES exam_sets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
