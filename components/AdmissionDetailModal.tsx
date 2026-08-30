"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faListCheck,
  faUserCheck,
  faCalendarDays,
  faUsers,
  faLocationDot,
  faClock,
  faRulerVertical,
  faFilePdf,
  faCircleInfo,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";

export interface ScoreBadge {
  key: string;
  label: string;
  weight: number;
}

export interface RequirementBadge {
  label: string;
  value: string;
}

export interface AdmissionDetails {
  description: string | null;
  condition: string | null;
  openDateShort: string | null;
  openDateNote: string | null;
  closedDate: string | null;
  interviewDate: string | null;
  interviewTime: string | null;
  interviewLocation: string | null;
  minGpaBreakdown: RequirementBadge[];
  physicalRequirements: RequirementBadge[];
}

export interface AdmissionCriteriaItem {
  id: number;
  university: string;
  universityId?: string | null;
  round?: string;
  faculty: string;
  major: string;
  concentration?: string | null;
  projectName?: string | null;
  roundName: string;
  quota: number;
  gpaxMin: string;
  scoreBreakdown: ScoreBadge[];
  details: AdmissionDetails | null;
  sourceUrl: string;
  sourceLabel: string;
  isCustomPortal?: boolean;
  verifiedAt: string;
  pdfUrl: string | null;
}

// หาตำแหน่งเริ่มต้นของแต่ละข้อ "N." ในข้อความหนึ่งบรรทัด — ตัวเลขข้อบางที่พิมพ์ติดกัน ("1.เป็นผู้ที่")
// บางที่เว้นวรรค ("3. หน่วยกิต") จึงเว้นช่องว่างเป็น optional แต่ต้องกันไม่ให้ไปตัดทศนิยมอย่าง
// "3.00" โดยดูว่าตัวอักษรถัดจากจุดต้อง "ไม่ใช่ตัวเลข" (ทศนิยมจริงจะตามด้วยเลขเสมอ)
function splitInlineNumberedLine(line: string): string[] {
  const markerRe = /(\d{1,2})\.\s*(?=[^\d])/g;
  const starts: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = markerRe.exec(line))) {
    const before = line[m.index - 1];
    if (m.index === 0 || /\s/.test(before)) {
      starts.push(m.index);
    }
  }
  if (starts.length < 2) {
    return [line.replace(/^\d{1,2}\.\s*/, "").trim()].filter(Boolean);
  }
  const items: string[] = [];
  for (let i = 0; i < starts.length; i++) {
    const chunk = line.slice(starts[i], starts[i + 1] ?? line.length).trim();
    const withoutMarker = chunk.replace(/^\d{1,2}\.\s*/, "").trim();
    if (withoutMarker) items.push(withoutMarker);
  }
  return items;
}

// ข้อมูลคุณสมบัติผู้สมัครจากแต่ละมหาวิทยาลัยมีรูปแบบไม่เหมือนกัน บางที่คั่นด้วย "|" (ข้อมูลที่เราใส่เอง)
// บางที่คั่นด้วยขึ้นบรรทัดใหม่ บางที่อัดข้อความ "1.xxx 2.xxx 3.xxx" ต่อกันในบรรทัดเดียวไม่มีตัวคั่นเลย
// และบางที่ผสมกันทั้งสองแบบในข้อความเดียว จึงต้องแยกทีละบรรทัดก่อน แล้วลองแกะเลขข้อในแต่ละบรรทัดอีกที
function splitConditionText(raw: string): string[] {
  const text = raw.trim();
  if (!text) return [];

  if (text.includes("|")) {
    return text.split("|").map((s) => s.trim()).filter(Boolean);
  }

  const lines = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return lines.flatMap(splitInlineNumberedLine);
}

export default function AdmissionDetailModal({
  item,
  onClose,
}: {
  item: AdmissionCriteriaItem | null;
  onClose: () => void;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [editingPdf, setEditingPdf] = useState(false);
  const [pdfInput, setPdfInput] = useState("");
  const [applyToWholeBatch, setApplyToWholeBatch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveNotice, setSaveNotice] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.user?.role === "admin"))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    setPdfUrl(item?.pdfUrl ?? null);
    setEditingPdf(false);
    setPdfInput(item?.pdfUrl ?? "");
    setApplyToWholeBatch(false);
    setSaveError("");
    setSaveNotice("");
  }, [item]);

  useEffect(() => {
    if (!item) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  const hasSchedule =
    item.details?.openDateShort || item.details?.closedDate || item.details?.interviewDate;
  const minGpaBreakdown = item.details?.minGpaBreakdown ?? [];
  const physicalRequirements = item.details?.physicalRequirements ?? [];
  const conditionItems = splitConditionText(item.details?.condition ?? "");

  async function handleSavePdfUrl() {
    setSaving(true);
    setSaveError("");
    setSaveNotice("");
    try {
      if (applyToWholeBatch && item!.universityId && item!.round) {
        const res = await fetch(`/api/admin/admissions/bulk-pdf-url`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            universityId: item!.universityId,
            round: item!.round,
            pdfUrl: pdfInput.trim(),
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setSaveError(data?.error || "บันทึกไม่สำเร็จ");
          return;
        }
        setPdfUrl(data.pdfUrl);
        setEditingPdf(false);
        setSaveNotice(`บันทึกแล้ว — อัปเดตลิงก์นี้ให้ทั้งหมด ${data.affectedRows.toLocaleString("th-TH")} โครงการของ ${item!.university} รอบเดียวกัน`);
        return;
      }

      const res = await fetch(`/api/admin/admissions/${item!.id}/pdf-url`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: pdfInput.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSaveError(data?.error || "บันทึกไม่สำเร็จ");
        return;
      }
      setPdfUrl(data.pdfUrl);
      setEditingPdf(false);
    } catch {
      setSaveError("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0b1e3d]/60" onClick={onClose} />

      {/* กรอบนอก: กำหนดความมนและ clip เนื้อหาด้านในให้โค้งตามจริง ไม่มีเงา */}
      <div id="admission-pdf-content" className="relative w-full max-w-lg overflow-hidden rounded-md bg-white">
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50 px-6 py-5 text-[#003b73] print:static">
            <button
              onClick={onClose}
              aria-label="ปิด"
              className="nb-no-print absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-gray-500 hover:bg-black/10"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <span className="inline-block rounded-md bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
              {item.roundName}
            </span>
            <h2 className="mt-2 pr-8 text-base font-extrabold leading-snug text-[#003b73]">{item.university}</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {item.faculty} - {item.major}
            </p>
            {item.projectName && (
              <p className="mt-1 text-xs font-bold text-[#003b73]">โครงการ: {item.projectName}</p>
            )}
            {item.concentration && (
              <span className="mt-1.5 inline-block rounded-md bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                แขนงวิชา: {item.concentration}
              </span>
            )}
          </div>

          <div className="space-y-5 p-6">
            {/* คะแนนที่ต้องใช้ */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-extrabold text-[#003b73]">
                <FontAwesomeIcon icon={faListCheck} className="text-blue-500" />
                ต้องใช้คะแนนอะไรบ้าง
              </h3>
              {item.scoreBreakdown.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.scoreBreakdown.map((badge) => (
                    <span
                      key={badge.key}
                      className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-[#003b73]"
                    >
                      {badge.label} <span className="text-blue-500">{badge.weight}%</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">
                  รอบนี้พิจารณาจากคุณสมบัติเฉพาะโครงการ ไม่ได้กำหนดสัดส่วนคะแนนแบบตายตัว
                </p>
              )}

              {minGpaBreakdown.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-[11px] font-bold text-gray-500">เกรดเฉลี่ยขั้นต่ำรายกลุ่มสาระ:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {minGpaBreakdown.map((req) => (
                      <span
                        key={req.label}
                        className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700"
                      >
                        {req.label} <span className="text-emerald-500">≥ {req.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* คุณสมบัติผู้สมัคร */}
            <section className="border-t border-gray-100 pt-4">
              <h3 className="flex items-center gap-2 text-xs font-extrabold text-[#003b73]">
                <FontAwesomeIcon icon={faUserCheck} className="text-emerald-500" />
                คุณสมบัติผู้สมัคร
              </h3>
              <div className="mt-2 space-y-2 text-xs text-gray-600">
                <p>
                  GPAX ขั้นต่ำ: <strong className="text-gray-800">{item.gpaxMin}</strong>
                </p>
                {physicalRequirements.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {physicalRequirements.map((req) => (
                      <span
                        key={req.label}
                        className="flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-bold text-purple-700"
                      >
                        <FontAwesomeIcon icon={faRulerVertical} className="text-[10px]" />
                        {req.label}: {req.value}
                      </span>
                    ))}
                  </div>
                )}
                {item.details?.description && (
                  <p className="rounded-lg bg-gray-50 p-2.5 leading-relaxed">{item.details.description}</p>
                )}
                {conditionItems.length > 1 ? (
                  <ol className="list-decimal space-y-1.5 rounded-lg bg-gray-50 p-2.5 pl-6 leading-relaxed">
                    {conditionItems.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ol>
                ) : (
                  conditionItems[0] && (
                    <p className="rounded-lg bg-gray-50 p-2.5 leading-relaxed">{conditionItems[0]}</p>
                  )
                )}
                {!item.details?.description && !item.details?.condition && (
                  <p className="text-gray-400">ไม่มีเงื่อนไขเพิ่มเติมนอกจากเกณฑ์คะแนนด้านบน</p>
                )}
              </div>
            </section>

            {/* กำหนดการ */}
            <section className="border-t border-gray-100 pt-4">
              <h3 className="flex items-center gap-2 text-xs font-extrabold text-[#003b73]">
                <FontAwesomeIcon icon={faCalendarDays} className="text-orange-500" />
                กำหนดการ
              </h3>
              {hasSchedule ? (
                <div className="mt-2 space-y-2 text-xs text-gray-600">
                  {item.details?.openDateShort && (
                    <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-2.5">
                      <FontAwesomeIcon icon={faCalendarDays} className="mt-0.5 text-emerald-600" />
                      <div>
                        <p>
                          เปิดรับสมัคร: <strong className="text-gray-800">{item.details.openDateShort}</strong>
                        </p>
                        {item.details.openDateNote && (
                          <p className="mt-0.5 text-[11px] text-gray-500">{item.details.openDateNote}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {item.details?.closedDate && (
                    <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-2.5">
                      <FontAwesomeIcon icon={faClock} className="text-orange-500" />
                      <span>
                        ปิดรับสมัครวันที่ <strong className="text-gray-800">{item.details.closedDate}</strong>
                      </span>
                    </div>
                  )}
                  {item.details?.interviewDate && (
                    <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-2.5">
                      <FontAwesomeIcon icon={faCalendarDays} className="mt-0.5 text-blue-500" />
                      <div>
                        <p>
                          วันสัมภาษณ์: <strong className="text-gray-800">{item.details.interviewDate}</strong>
                          {item.details.interviewTime ? ` เวลา ${item.details.interviewTime}` : ""}
                        </p>
                        {item.details.interviewLocation && (
                          <p className="mt-1 flex items-start gap-1.5 text-gray-500">
                            <FontAwesomeIcon icon={faLocationDot} className="mt-0.5" />
                            {item.details.interviewLocation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-1.5 text-xs text-gray-400">
                  ยังไม่มีการประกาศกำหนดการสัมภาษณ์หรือวันปิดรับสมัครในระบบ
                </p>
              )}
            </section>

            {/* ประกาศรับสมัครฉบับ PDF โดยตรงของโครงการนี้ (ไม่ใช่ลิงก์เว็บทั่วไปของมหาวิทยาลัย) */}
            {pdfUrl ? (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="nb-no-print flex items-center justify-center gap-2 rounded-md bg-[#002b55] py-3.5 text-xs font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#004b8d]"
              >
                <FontAwesomeIcon icon={faFilePdf} className="text-red-300" />
                ดาวน์โหลดประกาศรับสมัคร PDF (ฉบับทางการ)
              </a>
            ) : (
              <div className="nb-no-print flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-50 py-3.5 text-xs font-bold text-gray-400">
                <FontAwesomeIcon icon={faCircleInfo} />
                ยังไม่มีประกาศ PDF จากมหาวิทยาลัยนี้
              </div>
            )}

            {isAdmin && (
              <div className="nb-no-print rounded-md border border-dashed border-blue-200 bg-blue-50/40 p-3">
                {editingPdf ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={pdfInput}
                      onChange={(e) => setPdfInput(e.target.value)}
                      placeholder="วางลิงก์ไฟล์ PDF ประกาศรับสมัคร (https://...)"
                      className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs focus:border-blue-400 focus:outline-none"
                    />
                    {item.universityId && item.round && (
                      <label className="flex items-start gap-1.5 text-[11px] text-gray-600">
                        <input
                          type="checkbox"
                          checked={applyToWholeBatch}
                          onChange={(e) => setApplyToWholeBatch(e.target.checked)}
                          className="mt-0.5"
                        />
                        <span>
                          ไฟล์นี้เป็นประกาศรวมหลายคณะ — ใช้ลิงก์นี้กับ<strong>ทุกโครงการของ {item.university} ใน{item.roundName}</strong>ด้วย
                        </span>
                      </label>
                    )}
                    {saveError && <p className="text-[11px] font-bold text-red-500">{saveError}</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePdfUrl}
                        disabled={saving}
                        className="flex items-center gap-1.5 rounded-md bg-[#003b73] px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-[#004b8d] disabled:opacity-60"
                      >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                        {saving ? "กำลังบันทึก..." : "บันทึก"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingPdf(false);
                          setPdfInput(pdfUrl ?? "");
                          setSaveError("");
                        }}
                        className="rounded-md px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-100"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setEditingPdf(true)}
                      className="text-[11px] font-bold text-[#003b73] hover:underline"
                    >
                      {pdfUrl ? "แก้ไขลิงก์ PDF (แอดมิน)" : "+ เพิ่มลิงก์ PDF ประกาศ (แอดมิน)"}
                    </button>
                    {saveNotice && <p className="mt-1.5 text-[11px] font-bold text-emerald-600">{saveNotice}</p>}
                  </div>
                )}
              </div>
            )}

            {/* ดาวน์โหลดเกณฑ์การรับสมัครฉบับนี้เป็น PDF */}
            <button
              onClick={() => window.print()}
              className="nb-no-print flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-blue-200 bg-blue-50/60 py-3 text-xs font-extrabold text-[#003b73] transition-colors hover:bg-blue-100"
            >
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
              ดาวน์โหลดเกณฑ์นี้เป็น PDF
            </button>

            {/* Footer info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUsers} />
                รับจำนวน {item.quota.toLocaleString("th-TH")} คน · ตรวจสอบล่าสุด {item.verifiedAt}
              </span>
              <span className="flex items-center gap-1">
                ข้อมูลอ้างอิงจาก {item.sourceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
