"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faMagnifyingGlass,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";

interface UniversitySummary {
  universityId: string;
  university: string;
  programCount: number;
}

function UniversityLogo({ universityId, university }: { universityId: string; university: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-[#005a9c]">
        <FontAwesomeIcon icon={faBuildingColumns} />
      </div>
    );
  }

  return (
    <img
      src={`https://assets.mytcas.com/i/logo/${universityId}.png`}
      alt={university}
      onError={() => setFailed(true)}
      className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 object-contain bg-white p-1.5"
    />
  );
}

export default function UniversitiesSelectorPage() {
  const [universities, setUniversities] = useState<UniversitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/admissions/universities")
      .then((res) => res.json())
      .then((data) => setUniversities(data.universities ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return universities;
    const term = searchTerm.trim().toLowerCase();
    return universities.filter((u) => u.university.toLowerCase().includes(term));
  }, [universities, searchTerm]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        <Link
          href="/prepare"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeftLong} />
          กลับไปหน้าเตรียมพร้อม
        </Link>

        <div className="mt-2 mb-8">
          <h1 className="text-3xl font-extrabold text-[#003b73] sm:text-4xl">
            เลือกมหาวิทยาลัย
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            เลือกมหาวิทยาลัยที่สนใจ เพื่อดูเกณฑ์การรับสมัคร TCAS70 ทุกคณะทุกสาขาของมหาวิทยาลัยนั้นโดยตรง
          </p>
        </div>

        <div className="relative mb-6 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="พิมพ์ชื่อมหาวิทยาลัย..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-700 outline-none transition-all focus:border-blue-500 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-xs text-gray-400">
            กำลังโหลดรายชื่อมหาวิทยาลัย...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-xs text-gray-400">
            ไม่พบมหาวิทยาลัยที่ตรงกับคำค้นหา
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-gray-400">พบ {filtered.length.toLocaleString("th-TH")} มหาวิทยาลัย</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((u) => (
                <Link
                  key={u.universityId}
                  href={`/prepare/universities/${u.universityId}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <UniversityLogo universityId={u.universityId} university={u.university} />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-800 leading-snug">{u.university}</h3>
                    <p className="mt-1 text-[11px] font-semibold text-blue-600">
                      {u.programCount.toLocaleString("th-TH")} หลักสูตร/รอบ
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
