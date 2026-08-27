"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faListCheck,
  faBuildingColumns,
  faFilePdf,
  faCircleInfo,
  faChevronRight,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import AdmissionDetailModal, {
  type AdmissionDetails,
  type ScoreBadge,
} from "@/components/AdmissionDetailModal";

interface AdmissionCriteriaItem {
  id: number;
  university: string;
  universityId: string | null;
  faculty: string;
  major: string;
  concentration: string | null;
  projectName: string | null;
  round: string;
  roundName: string;
  quota: number;
  gpaxMin: string;
  scoreBreakdown: ScoreBadge[];
  details: AdmissionDetails | null;
  criteria: string;
  sourceUrl: string;
  sourceLabel: string;
  isCustomPortal: boolean;
  verifiedAt: string;
  pdfUrl: string | null;
}

interface UniversityInfo {
  universityId: string;
  university: string;
  programCount: number;
}

const ROUND_TABS = [
  { value: "", label: "ทุกรอบ" },
  { value: "1", label: "รอบ 1 Portfolio" },
  { value: "2", label: "รอบ 2 Quota" },
  { value: "3", label: "รอบ 3 Admission" },
  { value: "4", label: "รอบ 4 Direct Admission" },
];

const PDF_STATUS_TABS: { value: "" | "has" | "none"; label: string }[] = [
  { value: "", label: "ทั้งหมด" },
  { value: "has", label: "มีประกาศ PDF แล้ว" },
  { value: "none", label: "ยังไม่มีประกาศ" },
];

function UniversityLogo({ universityId, university }: { universityId: string; university: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white/10 text-3xl text-white">
        <FontAwesomeIcon icon={faBuildingColumns} />
      </div>
    );
  }

  return (
    <img
      src={`https://assets.mytcas.com/i/logo/${universityId}.png`}
      alt={university}
      data-no-fallback="true"
      onError={() => setFailed(true)}
      className="h-20 w-20 shrink-0 rounded-xl border border-white/20 bg-white object-contain p-2"
    />
  );
}

export default function UniversityDetailPage() {
  const params = useParams<{ id: string }>();
  const universityId = params.id;

  const [university, setUniversity] = useState<UniversityInfo | null | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRound, setSelectedRound] = useState("");
  const [selectedPdfStatus, setSelectedPdfStatus] = useState<"" | "has" | "none">("");
  const [criteria, setCriteria] = useState<AdmissionCriteriaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCriteria, setSelectedCriteria] = useState<AdmissionCriteriaItem | null>(null);
  const [drillFaculty, setDrillFaculty] = useState<string | null>(null);
  const [drillMajor, setDrillMajor] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admissions/universities/${universityId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUniversity(data.university))
      .catch(() => setUniversity(null));
  }, [universityId]);

  useEffect(() => {
    setDrillFaculty(null);
    setDrillMajor(null);
  }, [universityId]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const paramsQuery = new URLSearchParams({ universityId, limit: "3000" });
        if (searchTerm.trim()) paramsQuery.set("q", searchTerm.trim());
        if (selectedRound) paramsQuery.set("round", selectedRound);
        if (selectedPdfStatus) paramsQuery.set("pdfStatus", selectedPdfStatus);

        const response = await fetch(`/api/admissions?${paramsQuery.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load admissions criteria");

        const data = await response.json();
        setCriteria(data.criteria);
        setTotal(data.total);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setCriteria([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [universityId, searchTerm, selectedRound, selectedPdfStatus]);

  // เรียกดูตามหมวดหมู่ (คณะ -> สาขา -> โครงการย่อย) เฉพาะตอนไม่มีการค้นหา/กรอง — ถ้าค้นหาอยู่ให้แสดงผลลัพธ์แบบ list ตรงๆ
  const isBrowsingMode = !searchTerm.trim() && !selectedRound && !selectedPdfStatus;

  const facultyGroups = useMemo(() => {
    const map = new Map<string, AdmissionCriteriaItem[]>();
    for (const item of criteria) {
      const list = map.get(item.faculty) ?? [];
      list.push(item);
      map.set(item.faculty, list);
    }
    return map;
  }, [criteria]);

  const majorGroups = useMemo(() => {
    if (!drillFaculty) return new Map<string, AdmissionCriteriaItem[]>();
    const map = new Map<string, AdmissionCriteriaItem[]>();
    for (const item of facultyGroups.get(drillFaculty) ?? []) {
      const list = map.get(item.major) ?? [];
      list.push(item);
      map.set(item.major, list);
    }
    return map;
  }, [facultyGroups, drillFaculty]);

  const programList = useMemo(() => {
    if (!drillFaculty || !drillMajor) return [];
    return majorGroups.get(drillMajor) ?? [];
  }, [majorGroups, drillFaculty, drillMajor]);

  function renderProgramCard(item: AdmissionCriteriaItem, showFacultyMajor: boolean) {
    return (
      <div
        key={item.id}
        className="rounded-xl border border-gray-100 bg-blue-50/30 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/60"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold text-[#005a9c]">{item.faculty}</span>
          <div className="flex items-center gap-1.5">
            {item.isCustomPortal && (
              <span className="rounded-xl bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                {item.sourceLabel}
              </span>
            )}
            <span className="rounded-xl bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-600">
              {item.roundName}
            </span>
          </div>
        </div>
        {showFacultyMajor && <h4 className="mt-1 text-xs font-bold text-gray-800">{item.major}</h4>}
        {item.projectName && (
          <p className="mt-1 text-xs font-bold text-[#003b73]">โครงการ: {item.projectName}</p>
        )}
        {item.concentration && (
          <span className="mt-1 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            แขนงวิชา: {item.concentration}
          </span>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
          <span>จำนวนรับ: <strong className="text-gray-700">{item.quota} คน</strong></span>
          <span>GPAX ขั้นต่ำ: <strong className="text-gray-700">{item.gpaxMin}</strong></span>
        </div>
        {item.details?.openDateShort && (
          <p className="mt-1.5 text-[11px] text-emerald-700">
            <strong>เปิดรับสมัคร:</strong> {item.details.openDateShort}
            {item.details.closedDate && ` — ปิดรับสมัคร ${item.details.closedDate}`}
          </p>
        )}

        <div className="mt-2 rounded-lg bg-white p-2.5 border border-gray-100">
          <p className="mb-1.5 text-[11px] font-bold text-blue-700">ต้องใช้คะแนนอะไรบ้าง:</p>
          {item.scoreBreakdown.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {item.scoreBreakdown.slice(0, 4).map((badge) => (
                <span
                  key={badge.key}
                  className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-[#003b73]"
                >
                  {badge.label} <span className="text-blue-500">{badge.weight}%</span>
                </span>
              ))}
              {item.scoreBreakdown.length > 4 && (
                <span className="rounded-md bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-400">
                  +{item.scoreBreakdown.length - 4}
                </span>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-gray-500">{item.criteria}</p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-gray-400">
          <span>ตรวจสอบล่าสุด: {item.verifiedAt}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCriteria(item)}
              className="flex items-center gap-1.5 font-bold text-blue-600 hover:underline"
            >
              <FontAwesomeIcon icon={faListCheck} />
              ดูรายละเอียดฉบับเต็ม
            </button>
            {item.pdfUrl ? (
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-lg bg-[#003b73] px-2.5 py-1 font-bold text-white hover:bg-[#004b8d]"
              >
                <FontAwesomeIcon icon={faFilePdf} />
                ประกาศ PDF
              </a>
            ) : (
              <span className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 font-bold text-gray-400">
                <FontAwesomeIcon icon={faCircleInfo} />
                ยังไม่มีประกาศมา
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

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

        {/* Header */}
        <div className="mt-3 flex items-center gap-4 rounded-xl bg-gradient-to-br from-[#002b55] via-[#004b8d] to-[#0066c4] p-6 text-white shadow-sm">
          <UniversityLogo universityId={universityId} university={university?.university ?? ""} />
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-snug sm:text-xl">
              {university === undefined ? "กำลังโหลด..." : university?.university ?? "ไม่พบมหาวิทยาลัย"}
            </h1>
            {university && (
              <p className="mt-1 text-xs text-blue-100">
                {university.programCount.toLocaleString("th-TH")} หลักสูตร/รอบการรับสมัคร (TCAS70)
              </p>
            )}
          </div>
        </div>

        {/* Search + round tabs */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาคณะ หรือ สาขาภายในมหาวิทยาลัยนี้..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-4 text-xs text-gray-700 outline-none transition-all focus:border-blue-500 focus:bg-white"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {ROUND_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedRound(tab.value)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  selectedRound === tab.value
                    ? "bg-[#003b73] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-[#003b73]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ปุ่มกรองตามสถานะประกาศ PDF */}
          <div className="mt-2 flex flex-wrap gap-2">
            {PDF_STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedPdfStatus(tab.value)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  selectedPdfStatus === tab.value
                    ? tab.value === "has"
                      ? "bg-emerald-600 text-white shadow-md"
                      : tab.value === "none"
                        ? "bg-gray-500 text-white shadow-md"
                        : "bg-[#003b73] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-[#003b73]"
                }`}
              >
                {tab.value === "has" && <FontAwesomeIcon icon={faFilePdf} />}
                {tab.value === "none" && <FontAwesomeIcon icon={faCircleInfo} />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-xs text-gray-400">
              กำลังโหลดเกณฑ์การรับสมัคร...
            </div>
          ) : criteria.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-xs text-gray-400">
              ไม่พบข้อมูลเกณฑ์การรับสมัครที่ตรงกับเงื่อนไขคำค้นหาของคุณ
            </div>
          ) : !isBrowsingMode ? (
            /* มีการค้นหา/กรองอยู่ — แสดงผลลัพธ์แบบ list ตรงๆ ไม่ต้องไล่ตามหมวดหมู่ */
            <>
              <p className="text-[11px] text-gray-400">
                พบ {total.toLocaleString("th-TH")} รายการ
                {total > criteria.length ? ` — แสดง ${criteria.length} รายการแรก` : ""}
              </p>
              {criteria.map((item) => renderProgramCard(item, true))}
            </>
          ) : !drillFaculty ? (
            /* ระดับ 1: เลือกคณะ */
            <>
              <p className="text-[11px] text-gray-400">
                {facultyGroups.size.toLocaleString("th-TH")} คณะ/หน่วยงาน — {total.toLocaleString("th-TH")} โครงการทั้งหมด
              </p>
              {Array.from(facultyGroups.entries()).map(([faculty, items]) => {
                const majorCount = new Set(items.map((i) => i.major)).size;
                return (
                  <button
                    key={faculty}
                    onClick={() => setDrillFaculty(faculty)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left transition-all hover:border-blue-200 hover:bg-blue-50/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <FontAwesomeIcon icon={faBuildingColumns} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{faculty}</p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {majorCount.toLocaleString("th-TH")} สาขา · {items.length.toLocaleString("th-TH")} โครงการ
                        </p>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="shrink-0 text-gray-300" />
                  </button>
                );
              })}
            </>
          ) : !drillMajor ? (
            /* ระดับ 2: เลือกสาขาภายในคณะที่เลือก */
            <>
              <button
                onClick={() => setDrillFaculty(null)}
                className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:underline"
              >
                <FontAwesomeIcon icon={faArrowLeftLong} />
                กลับไปเลือกคณะ
              </button>
              <p className="text-xs font-bold text-[#003b73]">{drillFaculty}</p>
              {Array.from(majorGroups.entries()).map(([major, items]) => (
                <button
                  key={major}
                  onClick={() => setDrillMajor(major)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left transition-all hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <FontAwesomeIcon icon={faLayerGroup} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{major}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {items.length.toLocaleString("th-TH")} โครงการย่อย
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="shrink-0 text-gray-300" />
                </button>
              ))}
            </>
          ) : (
            /* ระดับ 3: รายการโครงการย่อยของสาขาที่เลือก */
            <>
              <button
                onClick={() => setDrillMajor(null)}
                className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:underline"
              >
                <FontAwesomeIcon icon={faArrowLeftLong} />
                กลับไปเลือกสาขา
              </button>
              <p className="text-xs font-bold text-[#003b73]">
                {drillFaculty} <span className="text-gray-400">/</span> {drillMajor}
              </p>
              <p className="text-[11px] text-gray-400">
                {programList.length.toLocaleString("th-TH")} โครงการย่อยในสาขานี้
              </p>
              {programList.map((item) => renderProgramCard(item, false))}
            </>
          )}
        </div>
      </main>

      <Footer />

      <AdmissionDetailModal item={selectedCriteria} onClose={() => setSelectedCriteria(null)} />
    </div>
  );
}
