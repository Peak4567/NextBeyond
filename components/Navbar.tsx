"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const NAV_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "เตรียมพร้อม", href: "/prepare" },
  { label: "ชุมชนนักเรียน", href: "/community-students" },
  { label: "ข่าวสาร", href: "/news" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 flex w-full justify-center bg-[#f8fbff]/90 pt-4 pb-2 px-4 backdrop-blur-md">
      <header className="w-full max-w-4xl rounded-full bg-white px-6 py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-200">
        <nav className="flex items-center justify-between">
          
          {/* โลโก้ */}
          <Link href="/" className="flex items-center gap-3 pl-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white drop-shadow-sm border border-gray-100">
              <img
                src="/img/logo-nextbeyond.png"
                alt="NextBeyond Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-[17px] font-bold text-[#1e3a8a]">
              NextBeyond
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

          {/* ปุ่มเข้าสู่ระบบ (Desktop) */}
          <div className="hidden md:flex pr-2">
            <Link
              href="/login"
              className="flex items-center gap-2 text-[13px] text-gray-600 transition-colors hover:text-[#1e3a8a]"
            >
              <FontAwesomeIcon icon={faRightToBracket} className="text-gray-700" />
              เข้าสู่ระบบ
            </Link>
          </div>

          {/* ปุ่มเปิด/ปิด เมนูมือถือ */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="เปิดเมนู"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
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
          
          {/* ปุ่มเข้าสู่ระบบ (Mobile) */}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-5 flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-center text-[15px] font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-[#002b55]"
          >
            <FontAwesomeIcon icon={faRightToBracket} />
            เข้าสู่ระบบ
          </Link>
        </div>
      )}
    </div>
  );
}