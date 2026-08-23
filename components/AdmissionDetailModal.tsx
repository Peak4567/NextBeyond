"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faListCheck,
  faUserCheck,
  faCalendarDays,
  faUsers,
  faLocationDot,
  faClock,
  faArrowUpRightFromSquare,
  faRulerVertical,
  faFilePdf,
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
  faculty: string;
  major: string;
  roundName: string;
  quota: number;
  gpaxMin: string;
  scoreBreakdown: ScoreBadge[];
  details: AdmissionDetails | null;
  sourceUrl: string;
  sourceLabel: string;
  isCustomPortal?: boolean;
  verifiedAt: string;
}

export default function AdmissionDetailModal({
  item,
  onClose,
}: {
  item: AdmissionCriteriaItem | null;
  onClose: () => void;
}) {
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
                {item.details?.condition && (
                  <p className="rounded-lg bg-gray-50 p-2.5 leading-relaxed">{item.details.condition}</p>
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

            {/* ปุ่มสมัครสอบ — ลิงก์ไปหน้าสมัครจริงของโปรแกรมนี้ (ระบบมหาวิทยาลัยเอง หรือ mytcas.com) */}
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="nb-no-print flex items-center justify-center gap-2 rounded-md bg-[#002b55] py-3.5 text-xs font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#004b8d]"
            >
              {item.isCustomPortal
                ? `สมัครผ่านระบบของมหาวิทยาลัย: ${item.sourceLabel}`
                : `ไปสมัครสอบที่นี่ — ${item.sourceLabel}`}
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
            </a>

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
