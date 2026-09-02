USE nextbeyond;

-- Global site settings (key/value)
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admission criteria (was data/official-admissions.ts)
CREATE TABLE IF NOT EXISTS admission_criteria (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  academic_year VARCHAR(10) NOT NULL,
  university VARCHAR(150) NOT NULL,
  faculty VARCHAR(150) NOT NULL,
  major VARCHAR(150) NOT NULL,
  round VARCHAR(10) NOT NULL,
  round_name VARCHAR(100) NOT NULL,
  quota INT NOT NULL DEFAULT 0,
  gpax_min VARCHAR(50) NOT NULL,
  criteria TEXT NOT NULL,
  source_url VARCHAR(255) NOT NULL,
  source_label VARCHAR(150) NOT NULL,
  verified_at VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Portfolios: link to owner, approval workflow, optional uploaded cover
ALTER TABLE portfolios
  ADD COLUMN user_id INT UNSIGNED NULL AFTER id,
  ADD COLUMN status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved' AFTER user_id,
  ADD COLUMN cover_image VARCHAR(255) NULL AFTER cover_bg,
  ADD CONSTRAINT fk_portfolios_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS portfolio_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT UNSIGNED NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_portfolio_images_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS portfolio_likes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_portfolio_like (portfolio_id, user_id),
  CONSTRAINT fk_portfolio_likes_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  CONSTRAINT fk_portfolio_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS portfolio_comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_portfolio_comments_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
  CONSTRAINT fk_portfolio_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Community discussions: link to real users when created from the site
ALTER TABLE community_discussions
  ADD COLUMN user_id INT UNSIGNED NULL AFTER id,
  ADD CONSTRAINT fk_discussions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- News: cover image + block-based body content
ALTER TABLE news_articles
  ADD COLUMN cover_image VARCHAR(255) NULL AFTER image_color;

CREATE TABLE IF NOT EXISTS news_blocks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  news_article_id INT UNSIGNED NOT NULL,
  block_type ENUM('text', 'image') NOT NULL,
  text_content TEXT NULL,
  image_path VARCHAR(255) NULL,
  is_bold TINYINT(1) NOT NULL DEFAULT 0,
  is_italic TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_news_blocks_article FOREIGN KEY (news_article_id) REFERENCES news_articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
