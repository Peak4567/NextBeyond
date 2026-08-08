import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export const SETTINGS_DEFAULTS = {
  site_title: "NextBeyond | ก้าวเข้าสู่รั้วมหาวิทยาลัย",
  site_description: "ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยกับ NextBeyond",
  seo_title: "NextBeyond | ก้าวเข้าสู่รั้วมหาวิทยาลัย",
  seo_description: "ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยกับ NextBeyond",
  navbar_logo: "/img/logo-nextbeyond.png",
  footer_logo: "/img/footer-logo.png",
  footer_description: "ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยที่ช่วยให้น้อง ๆ ค้นพบเส้นทางการศึกษาที่ใช่ และก้าวเข้าสู่รั้วมหาวิทยาลัยได้อย่างมั่นใจ",
  footer_copyright: "© 2026 NextBeyond. สงวนลิขสิทธิ์ทุกประการ",
  contact_email: "contact@nextbeyond.co.th",
  contact_phone: "02-123-4567",
  social_facebook: "#",
  social_instagram: "#",
  social_line: "#",
  policy_content: "เงื่อนไขและนโยบายความเป็นส่วนตัวของ NextBeyond",
  live_news_ticker: "",
  maintenance_mode: "0",
  maintenance_message: "เว็บไซต์ปิดปรับปรุงชั่วคราว ขออภัยในความไม่สะดวก",
  theme_default: "light",
  admission_synced_at: "",
  admission_synced_count: "0",
} as const;

export type SettingsKey = keyof typeof SETTINGS_DEFAULTS;
export type SiteSettings = Record<SettingsKey, string>;

export async function getSettings(): Promise<SiteSettings> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT setting_key, setting_value FROM site_settings"
  );

  const overrides = Object.fromEntries(
    rows.map((row) => [row.setting_key, row.setting_value])
  );

  return { ...SETTINGS_DEFAULTS, ...overrides } as SiteSettings;
}

export async function updateSettings(values: Partial<Record<SettingsKey, string>>) {
  const entries = Object.entries(values);
  if (entries.length === 0) return;

  await Promise.all(
    entries.map(([key, value]) =>
      pool.query(
        `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, value]
      )
    )
  );
}
