"use client";

import Link from "next/link";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faLine } from "@fortawesome/free-brands-svg-icons";

const MENU_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "เตรียมพร้อม", href: "/prepare" },
  { label: "ชุมชนนักเรียน", href: "/community-students" },
  { label: "ข่าวสาร", href: "/news" },
];

export default function Footer() {
  const settings = useSiteSettings();

  const SOCIALS = [
    { label: "Facebook", href: settings?.social_facebook || "#", icon: faFacebookF },
    { label: "Instagram", href: settings?.social_instagram || "#", icon: faInstagram },
    { label: "Line", href: settings?.social_line || "#", icon: faLine },
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
              <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
              {settings?.contact_email || "contact@nextbeyond.co.th"}
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
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
                <FontAwesomeIcon icon={s.icon} className="h-4 w-4" />
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
