"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faUsers,
  faFileCircleCheck,
  faGear,
  faLayerGroup,
  faChevronDown,
  faBars,
  faXmark,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { ADMIN_RESOURCES } from "@/lib/adminResources";

const TOP_LINKS = [
  { href: "/admin", label: "แดชบอร์ด", icon: faGaugeHigh },
  { href: "/admin/users", label: "จัดการผู้ใช้งาน", icon: faUsers },
  { href: "/admin/portfolios", label: "อนุมัติผลงาน Portfolio", icon: faFileCircleCheck },
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: faGear },
];

export default function AdminSidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(
    pathname.startsWith("/admin/content") || pathname.startsWith("/admin/news")
  );

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const closeMobile = () => setMobileOpen(false);

  const navContent = (
    <>
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <img src="/img/logo-nextbeyond.png" alt="NextBeyond" className="h-8 w-auto shrink-0 object-contain" />
        <span className="text-sm font-bold text-[#1e3a8a]">NextBeyond Admin</span>
      </Link>

      {userName && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-semibold text-[#1e3a8a]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#1e3a8a] shadow-sm">
            {userName.charAt(0)}
          </span>
          <span className="truncate">{userName}</span>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto text-sm">
        {TOP_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobile}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 font-semibold transition-colors ${
              isActive(link.href)
                ? "bg-blue-50 text-[#1e3a8a]"
                : "text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a]"
            }`}
          >
            <FontAwesomeIcon icon={link.icon} className="w-4 shrink-0 text-center" />
            <span className="truncate">{link.label}</span>
          </Link>
        ))}

        <button
          type="button"
          onClick={() => setContentOpen((prev) => !prev)}
          className="mt-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-600"
        >
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLayerGroup} className="w-4 shrink-0 text-center" />
            จัดการเนื้อหาเว็บไซต์
          </span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-[10px] transition-transform ${contentOpen ? "rotate-180" : ""}`}
          />
        </button>

        {contentOpen && (
          <div className="space-y-1 pl-1">
            {Object.entries(ADMIN_RESOURCES).map(([key, config]) => {
              const href = `/admin/content/${key}`;
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={closeMobile}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                    active
                      ? "bg-blue-50 font-semibold text-[#1e3a8a]"
                      : "text-gray-600 hover:bg-blue-50 hover:text-[#1e3a8a]"
                  }`}
                >
                  <FontAwesomeIcon icon={config.icon} className="w-4 shrink-0 text-center" />
                  <span className="truncate">{config.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <Link
        href="/"
        className="mt-6 flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-400 transition-colors hover:text-gray-600"
      >
        <FontAwesomeIcon icon={faArrowLeftLong} className="w-4 shrink-0 text-center" />
        กลับหน้าเว็บไซต์
      </Link>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <img src="/img/logo-nextbeyond.png" alt="NextBeyond" className="h-7 w-auto object-contain" />
          <span className="text-sm font-bold text-[#1e3a8a]">NextBeyond Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="เปิดเมนู"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
          <aside className="relative flex h-full w-72 max-w-[85%] flex-col overflow-y-auto bg-white px-4 py-6 shadow-xl">
            <button
              type="button"
              onClick={closeMobile}
              aria-label="ปิดเมนู"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white px-4 py-6 md:flex">
        {navContent}
      </aside>
    </>
  );
}
