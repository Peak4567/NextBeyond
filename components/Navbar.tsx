"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faRightFromBracket,
  faUserCircle,
  faChevronDown,
  faGaugeHigh,
  faIdCard,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useSiteSettings } from "@/lib/useSiteSettings";

const NAV_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "เตรียมพร้อม", href: "/prepare" },
  { label: "ชุมชนนักเรียน", href: "/community-students" },
  { label: "ข่าวสาร", href: "/news" },
];

interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "member";
}

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const settings = useSiteSettings();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-50 flex w-full justify-center bg-[#f8fbff]/90 pt-4 pb-2 px-4 backdrop-blur-md dark:bg-slate-900/90">
      <header className="w-full max-w-4xl rounded-xl bg-white px-6 py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
        <nav className="flex items-center justify-between">

          {/* โลโก้ */}
          <Link href="/" className="flex items-center gap-3 pl-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white drop-shadow-sm border border-gray-100">
              <img
                src={settings?.navbar_logo || "/img/logo-nextbeyond.png"}
                alt="NextBeyond Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-[17px] font-bold text-[#1e3a8a]">
              {settings?.site_title?.split("|")[0].trim() || "NextBeyond"}
            </span>
          </Link>

          {/* เมนูหลัก (Desktop) */}
          <ul className="hidden flex-1 items-center justify-center gap-8 text-[13px] text-gray-500 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#1e3a8a]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ปุ่มเข้าสู่ระบบ / โปรไฟล์ (Desktop) */}
          <div className="hidden md:flex pr-2">
            {user ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-3 text-[13px] font-semibold text-[#1e3a8a] transition-colors hover:bg-blue-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[#1e3a8a]">
                    <FontAwesomeIcon icon={faUserCircle} />
                  </span>
                  {user.fullName}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-[10px] text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-bold text-gray-800">{user.fullName}</p>
                      <p className="truncate text-xs text-gray-400">{user.email}</p>
                      {user.role === "admin" && (
                        <span className="mt-1 inline-block rounded-xl bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          ADMIN
                        </span>
                      )}
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#1e3a8a]"
                    >
                      <FontAwesomeIcon icon={faIdCard} className="text-[#1e3a8a]" />
                      โปรไฟล์ของฉัน
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#1e3a8a]"
                      >
                        <FontAwesomeIcon icon={faGaugeHigh} className="text-[#1e3a8a]" />
                        ระบบหลังบ้าน
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-[13px] text-gray-600 transition-colors hover:text-[#1e3a8a]"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="text-gray-700" />
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* ปุ่มเปิด/ปิด เมนูมือถือ */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="เปิดเมนู"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 md:hidden"
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* เมนู Dropdown (Mobile) */}
      {open && (
        <div className="absolute top-[80px] left-0 z-40 w-full border-t border-gray-100 bg-white px-6 pb-6 shadow-lg md:hidden">
          <ul className="flex flex-col gap-4 pt-4 text-[15px] text-gray-600">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 transition-colors hover:text-[#1e3a8a]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ปุ่มเข้าสู่ระบบ / โปรไฟล์ (Mobile) */}
          {user ? (
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                <FontAwesomeIcon icon={faUserCircle} className="text-[#1e3a8a]" />
                <div className="overflow-hidden">
                  <p className="truncate text-[15px] font-bold text-[#1e3a8a]">{user.fullName}</p>
                  <p className="truncate text-[11px] text-gray-400">{user.email}</p>
                </div>
                {user.role === "admin" && (
                  <span className="ml-auto shrink-0 rounded-xl bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    ADMIN
                  </span>
                )}
              </div>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-center text-[15px] font-semibold text-[#1e3a8a] shadow-sm transition-all hover:bg-blue-50"
              >
                <FontAwesomeIcon icon={faIdCard} />
                โปรไฟล์ของฉัน
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-center text-[15px] font-semibold text-[#1e3a8a] shadow-sm transition-all hover:bg-blue-50"
                >
                  <FontAwesomeIcon icon={faGaugeHigh} />
                  ระบบหลังบ้าน
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-center text-[15px] font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-red-600"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-center text-[15px] font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#002b55]"
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
