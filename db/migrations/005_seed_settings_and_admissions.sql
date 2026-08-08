USE nextbeyond;

INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_title', 'NextBeyond | ก้าวเข้าสู่รั้วมหาวิทยาลัย'),
('site_description', 'ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยกับ NextBeyond'),
('seo_title', 'NextBeyond | ก้าวเข้าสู่รั้วมหาวิทยาลัย'),
('seo_description', 'ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยกับ NextBeyond'),
('navbar_logo', '/img/logo-nextbeyond.png'),
('footer_logo', '/img/footer-logo.png'),
('footer_description', 'ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยที่ช่วยให้น้อง ๆ ค้นพบเส้นทางการศึกษาที่ใช่ และก้าวเข้าสู่รั้วมหาวิทยาลัยได้อย่างมั่นใจ'),
('footer_copyright', '© 2026 NextBeyond. สงวนลิขสิทธิ์ทุกประการ'),
('contact_email', 'contact@nextbeyond.co.th'),
('contact_phone', '02-123-4567'),
('social_facebook', '#'),
('social_instagram', '#'),
('social_line', '#'),
('policy_content', 'เงื่อนไขและนโยบายความเป็นส่วนตัวของ NextBeyond\n\nข้อมูลของผู้ใช้งานจะถูกเก็บรักษาอย่างปลอดภัยและใช้เพื่อการให้บริการระบบแนะแนวการศึกษาเท่านั้น'),
('live_news_ticker', '[TCAS69 Update] ระบบ MyTCAS เตรียมเปิดลงทะเบียน 28 ต.ค. นี้ • เช็กเกณฑ์พอร์ตแพทย์ศิริราชฯ ล่าสุด • ม.เกษตรแจกทุนเรียนฟรี 100%'),
('maintenance_mode', '0'),
('maintenance_message', 'เว็บไซต์ปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวก'),
('theme_default', 'light');

INSERT INTO admission_criteria (academic_year, university, faculty, major, round, round_name, quota, gpax_min, criteria, source_url, source_label, verified_at, sort_order) VALUES
('2569', 'มหาวิทยาลัยเกษตรศาสตร์', 'คณะวิทยาศาสตร์ (บางเขน)', 'วท.บ. เคมีบูรณาการ (นานาชาติ)', '4', 'รอบ 4 Direct Admission', 5, '2.50 (6 ภาคเรียน)', 'GPAX 30% + สอบสัมภาษณ์ภาษาอังกฤษ 70%; ต้องมีผลภาษาอังกฤษตามที่โครงการกำหนด และ Portfolio ด้านวิทยาศาสตร์ไม่เกิน 10 หน้า', 'https://admission.ku.ac.th/majors/project/31/', 'เกณฑ์รับตรงอิสระ KU-TCAS69', '29 ก.ค. 2569', 1),
('2569', 'มหาวิทยาลัยเกษตรศาสตร์', 'คณะวิทยาศาสตร์ (บางเขน)', 'วท.บ. ชีวเคมี (ภาษาไทย ปกติ)', '4', 'รอบ 4 Direct Admission', 8, 'ไม่ระบุ', 'TGAT 40% + TPAT3 40% + A-Level เคมี 10% + A-Level ชีววิทยา 10%; ต้องมีหน่วยกิตวิทย์ 22, คณิต 12 และภาษาต่างประเทศ 9 หน่วยกิตขึ้นไป', 'https://admission.ku.ac.th/majors/project/31/', 'เกณฑ์รับตรงอิสระ KU-TCAS69', '29 ก.ค. 2569', 2),
('2569', 'มหาวิทยาลัยเกษตรศาสตร์', 'คณะวิทยาศาสตร์ (บางเขน)', 'วท.บ. วิทยาศาสตร์ชีวภาพและเทคโนโลยี (นานาชาติ)', '4', 'รอบ 4 Direct Admission', 30, '2.50 (6 ภาคเรียน)', 'ผลการเรียน/วุฒิเทียบเท่า 80% + คะแนนภาษาอังกฤษหรือสัมภาษณ์ภาษาอังกฤษ 20%; ผู้สมัครต้องมี Portfolio และผลภาษาอังกฤษตามเกณฑ์โครงการ', 'https://admission.ku.ac.th/majors/project/31/', 'เกณฑ์รับตรงอิสระ KU-TCAS69', '29 ก.ค. 2569', 3),
('2569', 'มหาวิทยาลัยเกษตรศาสตร์', 'คณะวิทยาศาสตร์ (บางเขน)', 'วท.บ. วิทยาศาสตร์นิวเคลียร์ (ภาษาไทย ปกติ)', '4', 'รอบ 4 Direct Admission', 5, 'ไม่ระบุ', 'TGAT 30% + TPAT3 70%; ต้องมีหน่วยกิตคณิตศาสตร์ 12 หน่วยกิต และวิทยาศาสตร์ 22 หน่วยกิตขึ้นไป', 'https://admission.ku.ac.th/majors/project/31/', 'เกณฑ์รับตรงอิสระ KU-TCAS69', '29 ก.ค. 2569', 4),
('2569', 'มหาวิทยาลัยเกษตรศาสตร์', 'คณะวิศวกรรมศาสตร์ (บางเขน)', 'วศ.บ. วิศวกรรมสิ่งแวดล้อม (นานาชาติ)', '4', 'รอบ 4 Direct Admission', 5, 'ไม่ระบุ', 'TGAT1 25% + TPAT3 25% + A-Level คณิต 1 25% + A-Level ฟิสิกส์ 25%; มีการสัมภาษณ์เป็นภาษาอังกฤษ', 'https://admission.ku.ac.th/majors/project/31/', 'เกณฑ์รับตรงอิสระ KU-TCAS69', '29 ก.ค. 2569', 5);
