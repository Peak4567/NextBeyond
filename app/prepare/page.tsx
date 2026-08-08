"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AdmissionCriteriaItem {
  id: number;
  academicYear: string;
  university: string;
  faculty: string;
  major: string;
  round: string;
  roundName: string;
  quota: number;
  gpaxMin: string;
  criteria: string;
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
}

interface AdmissionApiResponse {
  criteria: AdmissionCriteriaItem[];
  total: number;
  source: {
    name: string;
    url: string;
    syncedAt: string | null;
    syncedCount: number;
    freshness: "live" | "cached";
  };
}

interface ChecklistItemState {
  id: number;
  name: string;
  done: boolean;
}

interface ImportantDateItem {
  id: number;
  day_label: string;
  month_label: string;
  title: string;
  description: string;
}

interface ExamBankItem {
  id: number;
  code: string;
  title: string;
  meta: string;
  color: string;
}

export default function PreparePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRound, setSelectedRound] = useState("");
  const [criteria, setCriteria] = useState<AdmissionCriteriaItem[]>([]);
  const [criteriaTotal, setCriteriaTotal] = useState(0);
  const [isLoadingCriteria, setIsLoadingCriteria] = useState(true);
  const [sourceStatus, setSourceStatus] = useState<AdmissionApiResponse["source"] | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItemState[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDateItem[]>([]);
  const [examBank, setExamBank] = useState<ExamBankItem[]>([]);

  const EXAM_BANK_COLOR_CLASSES: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
  };

  const TRENDING_TAGS = [
    "วิศวกรรมคอมพิวเตอร์",
    "แพทยศาสตร์",
    "บริหารธุรกิจ",
    "นิเทศศาสตร์",
    "วิทยาการข้อมูล",
  ];

  const hasActiveQuery = searchTerm.trim() !== "" || selectedRound !== "";

  useEffect(() => {
    const controller = new AbortController();

    async function loadPrepareContent() {
      try {
        const response = await fetch("/api/content/prepare", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load prepare content");

        const data = await response.json();
        setChecklist(
          data.checklistItems.map((item: { id: number; name: string; is_default_done: number }) => ({
            id: item.id,
            name: item.name,
            done: Boolean(item.is_default_done),
          }))
        );
        setImportantDates(data.importantDates);
        setExamBank(data.examBank);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setChecklist([]);
          setImportantDates([]);
          setExamBank([]);
        }
      }
    }

    loadPrepareContent();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoadingCriteria(true);

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("q", searchTerm.trim());
        if (selectedRound) params.set("round", selectedRound);

        const response = await fetch(`/api/admissions?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load admissions criteria");

        const data: AdmissionApiResponse = await response.json();
        setCriteria(data.criteria);
        setCriteriaTotal(data.total);
        setSourceStatus(data.source);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setCriteria([]);
          setCriteriaTotal(0);
        }
      } finally {
        setIsLoadingCriteria(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchTerm, selectedRound]);

  // สลับสถานะของ Checklist
  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // คำนวณเปอร์เซ็นต์ความพร้อมเอกสาร
  const completedCount = checklist.filter((item) => item.done).length;
  const progressPercentage =
    checklist.length === 0 ? 0 : Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        {/* --- Header Section --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#003b73] sm:text-4xl">
            เตรียมตัวเข้าสู่มหาวิทยาลัย
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            วางแผนอนาคตของคุณให้เป็นระบบด้วยเครื่องมืออัจฉริยะจาก NextBeyond
          </p>
        </div>

        {/* --- Main Content Grid Layout --- */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* ================= LEFT COLUMN (Col 7) ================= */}
          <div className="space-y-6 lg:col-span-7">

            {/* 1. ค้นหาเกณฑ์การรับสมัคร TCAS */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-base font-bold text-[#003b73]">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>ค้นหาเกณฑ์การรับสมัคร TCAS70</span>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="พิมพ์คณะ สาขา หรือ มหาวิทยาลัยที่สนใจ..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-4 text-xs text-gray-700 outline-none transition-all focus:border-blue-500 focus:bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-xs text-gray-600 outline-none focus:border-blue-500"
                >
                  <option value="">เลือกทุกรอบ (TCAS 1-4)</option>
                  <option value="1">รอบ 1 Portfolio</option>
                  <option value="2">รอบ 2 Quota</option>
                  <option value="3">รอบ 3 Admission</option>
                  <option value="4">รอบ 4 Direct Admission</option>
                </select>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800">
                <span>
                  {!sourceStatus
                    ? "กำลังตรวจสอบข้อมูลจากประกาศทางการ..."
                    : sourceStatus.freshness === "live"
                      ? `เชื่อมต่อข้อมูลจริงจาก ${sourceStatus.name} แล้ว — ${sourceStatus.syncedCount.toLocaleString("th-TH")} รายการทั่วประเทศ`
                      : "ยังไม่เคยซิงค์ข้อมูลจาก TCAS — แอดมินสามารถซิงค์ได้ที่ระบบหลังบ้าน"}
                </span>
                {sourceStatus?.syncedAt && (
                  <span className="font-semibold">อัปเดต: {new Date(sourceStatus.syncedAt).toLocaleString("th-TH")}</span>
                )}
              </div>

              {/* Trending Tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">ค้นหายอดนิยม:</span>
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] transition-colors ${
                      searchTerm === tag
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Display Filtered Results */}
              <div className="mt-5 space-y-3">
                {!hasActiveQuery ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
                    พิมพ์คำค้นหาหรือกดแท็กด้านบน เพื่อค้นหาเกณฑ์การรับสมัครจากทั้งหมด{" "}
                    <strong className="text-gray-600">
                      {sourceStatus ? sourceStatus.syncedCount.toLocaleString("th-TH") : "…"}
                    </strong>{" "}
                    รายการทั่วประเทศ
                  </div>
                ) : isLoadingCriteria ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
                    กำลังค้นหาเกณฑ์การรับสมัครจากแหล่งข้อมูลทางการ...
                  </div>
                ) : criteria.length > 0 ? (
                  <>
                    <p className="text-[11px] text-gray-400">
                      พบ {criteriaTotal.toLocaleString("th-TH")} รายการ
                      {criteriaTotal > criteria.length ? ` — แสดง ${criteria.length} รายการแรก` : ""}
                    </p>
                    {criteria.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-gray-100 bg-blue-50/30 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/60"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold text-[#005a9c]">
                            {item.university}
                          </span>
                          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-600">
                            {item.roundName}
                          </span>
                        </div>
                        <h4 className="mt-1 text-xs font-bold text-gray-800">
                          {item.faculty} - {item.major}
                        </h4>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
                          <span>จำนวนรับ: <strong className="text-gray-700">{item.quota} คน</strong></span>
                          <span>GPAX ขั้นต่ำ: <strong className="text-gray-700">{item.gpaxMin}</strong></span>
                        </div>
                        <div className="mt-2 rounded-lg bg-white p-2.5 text-[11px] text-gray-600 border border-gray-100">
                          <strong className="text-blue-700">เกณฑ์การคัดเลือก: </strong>
                          {item.criteria}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-gray-400">
                          <span>ตรวจสอบล่าสุด: {item.verifiedAt}</span>
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-blue-600 hover:underline"
                          >
                            เข้าไปอ่านประกาศต้นทางจริง ↗
                          </a>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
                    ไม่พบข้อมูลเกณฑ์การรับสมัครที่ตรงกับเงื่อนไขคำค้นหาของคุณ
                  </div>
                )}
              </div>
            </div>

            {/* 2. Admission Roadmap */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-base font-bold text-[#003b73]">
                <div className="h-4 w-4 rounded-md border-2 border-orange-400 bg-orange-100" />
                <span>Admission Roadmap</span>
              </div>

              {/* Timeline Steps */}
              <div className="relative mt-8 mb-4">
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200" />

                <div className="relative z-10 grid grid-cols-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a8a] text-xs font-bold text-white shadow-md">
                      1
                    </div>
                    <span className="mt-3 text-xs font-bold text-gray-800">สำรวจตัวเอง</span>
                    <span className="text-[10px] text-gray-400">ค้นหาคณะที่ใช่จากผลทดสอบ</span>
                    <span className="mt-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                      เสร็จสิ้นแล้ว
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a8a] text-xs font-bold text-white shadow-md ring-4 ring-orange-100">
                      2
                    </div>
                    <span className="mt-3 text-xs font-bold text-gray-800">สะสมผลงาน</span>
                    <span className="text-[10px] text-gray-400">ฝากกิจกรรมและวุฒิบัตรในคลัง</span>
                    <span className="mt-2 rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-600">
                      กำลังดำเนินการ
                    </span>
                  </div>

                  <div className="flex flex-col items-center opacity-60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                      3
                    </div>
                    <span className="mt-3 text-xs font-bold text-gray-800">จัดทำ Portfolio</span>
                    <span className="text-[10px] text-gray-400">เรียงร้อยเล่มด้วย AI ของ NextBeyond</span>
                  </div>

                  <div className="flex flex-col items-center opacity-60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                      4
                    </div>
                    <span className="mt-3 text-xs font-bold text-gray-800">ยื่นสมัคร</span>
                    <span className="text-[10px] text-gray-400">ส่งตรงในระบบ MyTCAS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. คลังข้อสอบเก่าย้อนหลัง */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#003b73]">คลังข้อสอบเก่าจำลอง (Mock Exam)</h3>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer">ดูทั้งหมด</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {examBank.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xs ${EXAM_BANK_COLOR_CLASSES[item.color] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {item.code}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                      <p className="text-[10px] text-gray-400">{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (Col 5) ================= */}
          <div className="space-y-6 lg:col-span-5">

            {/* 1. วันสำคัญที่ต้องจำ */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#003b73]">วันสำคัญที่ต้องจำ</h3>
                <a href="#" className="text-xs text-blue-600 hover:underline">ดูปฏิทินเต็ม</a>
              </div>

              <div className="mt-4 space-y-4">
                {importantDates.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-blue-50 text-center">
                      <span className="text-[10px] font-semibold text-blue-500">{item.month_label}</span>
                      <span className="text-base font-extrabold text-[#003b73] leading-none">{item.day_label}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                      <p className="mt-0.5 text-[11px] text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Checklist เอกสาร */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#003b73]">Checklist เอกสาร</h3>

              <div className="mt-4 space-y-2.5">
                {checklist.map((item) => (
                  <label key={item.id} className="flex cursor-pointer items-center gap-3 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklist(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={item.done ? "line-through text-gray-400" : ""}>{item.name}</span>
                  </label>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                  <span>ความพร้อมเอกสาร</span>
                  <span className="text-orange-500">{progressPercentage}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. ตารางอ่านหนังสือรายวัน */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#003b73]">ตารางอ่านหนังสือวันนี้</h3>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">3/5 วิชา</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5">
                  <span className="font-medium text-gray-700">09:00 - 11:00 น. | คณิตศาสตร์ A-Level</span>
                  <span className="text-[10px] text-emerald-600 font-bold">✓ เสร็จแล้ว</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5">
                  <span className="font-medium text-gray-700">13:00 - 15:00 น. | ภาษาอังกฤษ TGAT1</span>
                  <span className="text-[10px] text-orange-500 font-bold">กำลังอ่าน</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
