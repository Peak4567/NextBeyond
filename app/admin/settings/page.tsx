"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faGear,
  faGlobe,
  faMagnifyingGlass,
  faImage,
  faShareNodes,
  faBullhorn,
  faSliders,
  faFloppyDisk,
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { confirmSave } from "@/lib/sweetalert";

type Settings = Record<string, string>;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageOk, setMessageOk] = useState(true);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings ?? {}))
      .finally(() => setLoading(false));
  }, []);

  function setField(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(key: string, file: File) {
    setUploadingField(key);
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "settings");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json();
    if (res.ok) setField(key, data.url);
    setUploadingField(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const confirmed = await confirmSave({
      title: "ยืนยันการบันทึกการตั้งค่า?",
      text: "การเปลี่ยนแปลงจะมีผลกับเว็บไซต์ทันที",
    });
    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();

    if (res.ok) {
      setSettings(data.settings);
      setMessage("บันทึกการตั้งค่าเรียบร้อยแล้ว");
      setMessageOk(true);
    } else {
      setMessage(data.error || "บันทึกไม่สำเร็จ");
      setMessageOk(false);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-center text-xs text-gray-400">กำลังโหลดข้อมูล...</p>;
  }

  return (
    <form onSubmit={handleSave}>
      <h1 className="flex items-center gap-2.5 text-xl font-extrabold text-[#003b73] sm:text-2xl">
        <FontAwesomeIcon icon={faGear} className="text-[#005a9c]" />
        ตั้งค่าเว็บไซต์
      </h1>
      <p className="mt-1 text-sm text-gray-500">ปรับแต่งโลโก้ ชื่อเว็บ SEO ฟุตเตอร์ และการตั้งค่าระบบ</p>

      {message && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${
            messageOk
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <FontAwesomeIcon icon={messageOk ? faCircleCheck : faCircleExclamation} />
          {message}
        </div>
      )}

      {/* General */}
      <Section title="ทั่วไป" icon={faGlobe}>
        <TextField label="ชื่อเว็บไซต์" value={settings.site_title} onChange={(v) => setField("site_title", v)} />
        <TextField
          label="คำอธิบายเว็บไซต์"
          value={settings.site_description}
          onChange={(v) => setField("site_description", v)}
          textarea
        />
      </Section>

      {/* SEO */}
      <Section title="SEO" icon={faMagnifyingGlass}>
        <TextField label="SEO Title" value={settings.seo_title} onChange={(v) => setField("seo_title", v)} />
        <TextField
          label="SEO Description"
          value={settings.seo_description}
          onChange={(v) => setField("seo_description", v)}
          textarea
        />
      </Section>

      {/* Logos */}
      <Section title="โลโก้" icon={faImage}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageField
            label="โลโก้ Navbar"
            value={settings.navbar_logo}
            uploading={uploadingField === "navbar_logo"}
            onUpload={(file) => handleLogoUpload("navbar_logo", file)}
          />
          <ImageField
            label="โลโก้ Footer"
            value={settings.footer_logo}
            uploading={uploadingField === "footer_logo"}
            onUpload={(file) => handleLogoUpload("footer_logo", file)}
          />
        </div>
      </Section>

      {/* Footer */}
      <Section title="Footer" icon={faShareNodes}>
        <TextField
          label="คำอธิบายใน Footer"
          value={settings.footer_description}
          onChange={(v) => setField("footer_description", v)}
          textarea
        />
        <TextField label="ข้อความ Copyright" value={settings.footer_copyright} onChange={(v) => setField("footer_copyright", v)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="อีเมลติดต่อ" value={settings.contact_email} onChange={(v) => setField("contact_email", v)} />
          <TextField label="เบอร์โทรติดต่อ" value={settings.contact_phone} onChange={(v) => setField("contact_phone", v)} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField label="ลิงก์ Facebook" value={settings.social_facebook} onChange={(v) => setField("social_facebook", v)} />
          <TextField label="ลิงก์ Instagram" value={settings.social_instagram} onChange={(v) => setField("social_instagram", v)} />
          <TextField label="ลิงก์ Line" value={settings.social_line} onChange={(v) => setField("social_line", v)} />
        </div>
        <TextField
          label="เงื่อนไขและนโยบาย (แสดงที่หน้า /policy)"
          value={settings.policy_content}
          onChange={(v) => setField("policy_content", v)}
          textarea
          rows={6}
        />
      </Section>

      {/* News ticker */}
      <Section title="ข่าวล่าสุด (Live News Ticker)" icon={faBullhorn}>
        <TextField
          label="ข้อความข่าวด่วนบนหน้าข่าวสาร"
          value={settings.live_news_ticker}
          onChange={(v) => setField("live_news_ticker", v)}
          textarea
        />
      </Section>

      {/* System */}
      <Section title="ระบบ" icon={faSliders}>
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-gray-700">โหมดปิดปรับปรุงเว็บ</p>
            <p className="text-[11px] text-gray-400">เมื่อเปิดใช้งาน ผู้เยี่ยมชมทั่วไปจะเห็นหน้าปิดปรับปรุง (แอดมินยังเข้าเว็บได้ปกติ)</p>
          </div>
          <label className="relative inline-flex shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.maintenance_mode === "1"}
              onChange={(e) => setField("maintenance_mode", e.target.checked ? "1" : "0")}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-red-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>
        <TextField
          label="ข้อความหน้าปิดปรับปรุง"
          value={settings.maintenance_message}
          onChange={(v) => setField("maintenance_message", v)}
          textarea
        />

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-gray-700">โทนสีเว็บไซต์เริ่มต้น</p>
            <p className="text-[11px] text-gray-400">กำหนดโทนเริ่มต้นของทั้งเว็บไซต์ (White / Dark)</p>
          </div>
          <select
            value={settings.theme_default}
            onChange={(e) => setField("theme_default", e.target.value)}
            className="w-fit shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="light">White</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </Section>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#002b55] px-8 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:bg-[#004b8d] disabled:opacity-60 sm:w-auto"
      >
        <FontAwesomeIcon icon={faFloppyDisk} />
        {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
      </button>
    </form>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: IconDefinition;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-bold text-[#003b73]">
        <FontAwesomeIcon icon={icon} className="text-[#005a9c]" />
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-gray-700">{label}</label>
      {textarea ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
        />
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  uploading,
  onUpload,
}: {
  label: string;
  value: string | undefined;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-gray-700">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        {value && <img src={value} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 object-contain bg-white p-1" />}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
          className="w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-700"
        />
      </div>
      {uploading && <p className="mt-1 text-[10px] text-gray-400">กำลังอัปโหลด...</p>}
    </div>
  );
}
