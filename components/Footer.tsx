"use client";

import Link from "next/link";
import { useSiteSettings } from "@/lib/useSiteSettings";

const MENU_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "เตรียมพร้อม", href: "/prepare" },
  { label: "ชุมชนนักเรียน", href: "/community-students" },
  { label: "ข่าวสาร", href: "/news" },
];

export default function Footer() {
  const settings = useSiteSettings();

  const SOCIALS = [
    {
      label: "Facebook",
      href: settings?.social_facebook || "#",
      icon: (
        <path d="M13.5 9H15V6.5h-1.8C11.2 6.5 10 7.7 10 9.7V11H8.5v2.5H10V18h2.5v-4.5H14l.4-2.5h-1.9v-1c0-.6.2-1 1-1Z" />
      ),
    },
    {
      label: "Instagram",
      href: settings?.social_instagram || "#",
      icon: (
        <>
          <rect x="5" y="5" width="14" height="14" rx="4" />
          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16.2" cy="7.8" r="0.8" />
        </>
      ),
    },
    {
      label: "Line",
      href: settings?.social_line || "#",
      icon: <path d="M12 4C7 4 3 7.3 3 11.4c0 3.6 3.2 6.6 7.5 7.2.3.1.7.3.8.6.1.3 0 .8 0 1.1l-.1.8c0 .2-.2.9.8.5s5.4-3.2 7.4-5.5c1.4-1.5 2.1-3 2.1-4.7C21.5 7.3 17.5 4 12 4Z" />,
    },
  ];

  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="sm:col-span-2 lg:col-span-2">

          <div className="flex items-center">
            <img
              src={settings?.footer_logo || "/img/footer-logo.png"}
              alt="NextBeyond Logo"
              className="h-[60px] w-auto object-contain"
            />
          </div>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {settings?.footer_description ||
              "ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยที่ช่วยให้น้อง ๆ ค้นพบเส้นทางการศึกษาที่ใช่ และก้าวเข้าสู่รั้วมหาวิทยาลัยได้อย่างมั่นใจ"}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            เมนู
          </h4>
          <ul className="space-y-3 text-sm">
            {MENU_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-primary-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/policy" className="transition-colors hover:text-primary-400">
                เงื่อนไขและนโยบาย
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            ติดต่อเรา
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6l8 6 8-6M4 6v12h16V6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {settings?.contact_email || "contact@nextbeyond.co.th"}
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5c0 8 6 14 14 14l1-3.5-4.5-1-1 2C10 15 9 14 8.5 12.5l2-1L9.5 5H4Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              {settings?.contact_phone || "02-123-4567"}
            </li>
          </ul>

          <h4 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-white">
            Follow us
          </h4>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white hover:shadow-glow"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-slate-500 lg:px-10">
          {settings?.footer_copyright || "© 2026 NextBeyond. สงวนลิขสิทธิ์ทุกประการ"}
        </p>
      </div>
    </footer>
  );
}
