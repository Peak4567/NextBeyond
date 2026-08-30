"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faLocationDot,
  faArrowUpRightFromSquare,
  faCircleInfo,
  faChevronDown,
  faChevronUp,
  faListCheck,
  faPenToSquare,
  faCalendarDays,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";

interface InternationalUniversity {
  id: number;
  country: string;
  countryTh: string;
  nameEn: string;
  city: string;
  qsRank: number;
  qsRankDisplay: string;
  websiteUrl: string;
  admissionNote: string | null;
  documentsRequired: string | null;
  testPolicy: string | null;
  deadlines: string | null;
  applicationFee: string | null;
  criteriaSourceUrl: string | null;
  criteriaVerifiedAt: string | null;
}

const COUNTRIES = [
  { value: "United States", label: "สหรัฐอเมริกา" },
  { value: "China", label: "จีน" },
];

function splitPipeList(text: string | null): string[] {
  if (!text) return [];
  return text.split("|").map((s) => s.trim()).filter(Boolean);
}

function formatVerifiedDate(value: string | null): string {
  if (!value) return "-";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : value;
}

function domainFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\.|^en\.|^english\./, "");
  } catch {
    return null;
  }
}

function UniversityLogo({ websiteUrl, name, rankDisplay }: { websiteUrl: string; name: string; rankDisplay: string }) {
  const [failed, setFailed] = useState(false);
  const domain = domainFromUrl(websiteUrl);

  if (failed || !domain) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-extrabold text-[#005a9c]">
        #{rankDisplay}
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
      alt={name}
      onError={() => setFailed(true)}
      className="h-11 w-11 shrink-0 rounded-xl border border-gray-100 bg-white object-contain p-1.5"
    />
  );
}

function UniversityCard({ u }: { u: InternationalUniversity }) {
  const [open, setOpen] = useState(false);
  const hasCriteria = Boolean(u.documentsRequired || u.testPolicy || u.deadlines);
  const documents = splitPipeList(u.documentsRequired);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <UniversityLogo websiteUrl={u.websiteUrl} name={u.nameEn} rankDisplay={u.qsRankDisplay} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-gray-800 leading-snug">{u.nameEn}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="font-semibold text-[#005a9c]">#{u.qsRankDisplay}</span>
            <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
            {u.city}
          </p>
        </div>
        {!hasCriteria && (
          <span className="shrink-0 rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-400">
            ยังไม่มีเกณฑ์
          </span>
        )}
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="shrink-0 text-gray-300" />
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4">
          {hasCriteria ? (
            <div className="space-y-4">
              {documents.length > 0 && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#003b73]">
                    <FontAwesomeIcon icon={faListCheck} className="text-[11px]" />
                    เอกสาร/องค์ประกอบที่ต้องยื่น
                  </p>
                  <ol className="list-decimal space-y-1 rounded-lg bg-gray-50 p-2.5 pl-6 text-xs leading-relaxed text-gray-700">
                    {documents.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ol>
                </div>
              )}

              {u.testPolicy && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#003b73]">
                    <FontAwesomeIcon icon={faPenToSquare} className="text-[11px]" />
                    นโยบายคะแนนสอบ
                  </p>
                  <p className="rounded-lg bg-gray-50 p-2.5 text-xs leading-relaxed text-gray-700">{u.testPolicy}</p>
                </div>
              )}

              {u.deadlines && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#003b73]">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-[11px]" />
                    กำหนดการรับสมัคร
                  </p>
                  <p className="rounded-lg bg-gray-50 p-2.5 text-xs leading-relaxed text-gray-700">{u.deadlines}</p>
                </div>
              )}

              {u.applicationFee && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#003b73]">
                    <FontAwesomeIcon icon={faSackDollar} className="text-[11px]" />
                    ค่าธรรมเนียมสมัคร
                  </p>
                  <p className="rounded-lg bg-gray-50 p-2.5 text-xs leading-relaxed text-gray-700">{u.applicationFee}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-[10px] text-gray-400">
                <span>
                  ตรวจสอบล่าสุด: {formatVerifiedDate(u.criteriaVerifiedAt)} — ข้อมูลอาจเปลี่ยนแปลงได้ ควรตรวจสอบจากเว็บมหาวิทยาลัยโดยตรงก่อนสมัครจริง
                </span>
                {u.criteriaSourceUrl && (
                  <a
                    href={u.criteriaSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                  >
                    แหล่งที่มา
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-400">
              ยังไม่ได้ดึงเกณฑ์การรับสมัครของมหาวิทยาลัยนี้มาแสดง — กดลิงก์ด้านล่างเพื่อดูจากเว็บทางการโดยตรงไปก่อน
            </p>
          )}
          <a
            href={u.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            เว็บไซต์ทางการของมหาวิทยาลัย
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function InternationalUniversitiesPage() {
  const [universities, setUniversities] = useState<InternationalUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(COUNTRIES[0].value);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/international-universities?country=${encodeURIComponent(country)}`)
      .then((res) => res.json())
      .then((data) => setUniversities(data.universities ?? []))
      .finally(() => setLoading(false));
  }, [country]);

  const admissionNote = useMemo(() => universities[0]?.admissionNote ?? null, [universities]);
  const criteriaCount = useMemo(
    () => universities.filter((u) => u.documentsRequired || u.testPolicy || u.deadlines).length,
    [universities]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
        <Link
          href="/prepare/universities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeftLong} />
          กลับไปหน้าเลือกมหาวิทยาลัย
        </Link>

        <div className="mt-2 mb-6">
          <h1 className="text-3xl font-extrabold text-[#003b73] sm:text-4xl">มหาวิทยาลัยต่างประเทศ</h1>
          <p className="mt-1 text-sm text-gray-500">
            มหาวิทยาลัย Top 30 ของแต่ละประเทศ จัดอันดับตาม QS World University Rankings 2027
            (เผยแพร่ 18 มิ.ย. 2569) — กดที่การ์ดเพื่อดูเกณฑ์การรับสมัครโดยไม่ต้องออกจากหน้านี้
          </p>
        </div>

        <div className="mb-5 flex gap-2">
          {COUNTRIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCountry(c.value)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                country === c.value
                  ? "bg-[#003b73] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {admissionNote && (
          <div className="mb-3 flex items-start gap-2.5 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 shrink-0" />
            <span>{admissionNote}</span>
          </div>
        )}

        {!loading && universities.length > 0 && (
          <p className="mb-4 text-xs text-gray-400">
            มีเกณฑ์การรับสมัครให้ดูแล้ว {criteriaCount.toLocaleString("th-TH")} จาก {universities.length.toLocaleString("th-TH")} แห่ง
            (แห่งอื่นกำลังทยอยเพิ่ม)
          </p>
        )}

        {loading ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-xs text-gray-400">
            กำลังโหลดรายชื่อมหาวิทยาลัย...
          </div>
        ) : universities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-xs text-gray-400">
            ยังไม่มีข้อมูลมหาวิทยาลัยของประเทศนี้
          </div>
        ) : (
          <div className="space-y-2.5">
            {universities.map((u) => (
              <UniversityCard key={u.id} u={u} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
