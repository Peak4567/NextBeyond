"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faChevronLeft,
  faChevronRight,
  faGraduationCap,
  faLandmark,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { getHolidaysForMonth, LUNAR_HOLIDAY_NOTE } from "@/lib/thaiHolidays";

interface ImportantDateItem {
  id: number;
  day_label: string;
  month_label: string;
  title: string;
  description: string;
}

const THAI_MONTH_ABBR_TO_INDEX: Record<string, number> = {
  "ม.ค.": 1,
  "ก.พ.": 2,
  "มี.ค.": 3,
  "เม.ย.": 4,
  "พ.ค.": 5,
  "มิ.ย.": 6,
  "ก.ค.": 7,
  "ส.ค.": 8,
  "ก.ย.": 9,
  "ต.ค.": 10,
  "พ.ย.": 11,
  "ธ.ค.": 12,
};

const THAI_MONTH_NAMES = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const THAI_WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

// รอบรับสมัคร TCAS70 เริ่ม ส.ค. 2569 (2026) ต่อเนื่องถึง มิ.ย. 2570 (2027)
// เดือน ส.ค.-ธ.ค. จึงอยู่ในปี 2026 ส่วนเดือน ม.ค.-ก.ค. อยู่ในปี 2027 ของรอบเดียวกัน
function inferYearForMonth(monthIndex: number): number {
  return monthIndex >= 8 ? 2026 : 2027;
}

interface CalendarEvent {
  day: number;
  type: "tcas" | "holiday";
  title: string;
  description?: string;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function CalendarPage() {
  const [importantDates, setImportantDates] = useState<ImportantDateItem[]>([]);
  const today = new Date();
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(8); // เริ่มต้นที่จุดเริ่มรอบ 1 Portfolio (ส.ค. 2569)

  useEffect(() => {
    fetch("/api/content/prepare")
      .then((res) => res.json())
      .then((data) => setImportantDates(data.importantDates ?? []))
      .catch(() => setImportantDates([]));
  }, []);

  const tcasEventsByMonth = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const item of importantDates) {
      const monthIndex = THAI_MONTH_ABBR_TO_INDEX[item.month_label];
      if (!monthIndex) continue;
      const year = inferYearForMonth(monthIndex);
      const key = `${year}-${monthIndex}`;
      const list = map.get(key) ?? [];
      list.push({
        day: Number(item.day_label),
        type: "tcas",
        title: item.title,
        description: item.description,
      });
      map.set(key, list);
    }
    return map;
  }, [importantDates]);

  const key = `${viewYear}-${viewMonth}`;
  const tcasEvents = tcasEventsByMonth.get(key) ?? [];
  const holidays = getHolidaysForMonth(viewYear, viewMonth);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const ev of tcasEvents) {
      const list = map.get(ev.day) ?? [];
      list.push(ev);
      map.set(ev.day, list);
    }
    for (const h of holidays) {
      const list = map.get(h.day) ?? [];
      list.push({ day: h.day, type: "holiday", title: h.name });
      map.set(h.day, list);
    }
    return map;
  }, [tcasEvents, holidays]);

  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function goToMonth(delta: number) {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
  }

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() + 1 === viewMonth && today.getDate() === day;

  // รวมรายการเหตุการณ์ทั้งเดือนไว้แสดงเป็นลิสต์ด้านล่าง เรียงตามวันที่
  const monthEventList = Array.from(eventsByDay.entries())
    .sort(([a], [b]) => a - b)
    .flatMap(([, events]) => events);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
        <Link
          href="/prepare"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeftLong} />
          กลับไปหน้าเตรียมพร้อม
        </Link>

        <div className="mt-2 mb-6">
          <h1 className="text-3xl font-extrabold text-[#003b73] sm:text-4xl">ปฏิทินเตรียมสอบเข้ามหาวิทยาลัย</h1>
          <p className="mt-1 text-sm text-gray-500">
            ดูกำหนดการรับสมัคร TCAS70 และวันหยุดราชการ ครบทุกวันตลอดปีการศึกษา
          </p>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-blue-700">
              <FontAwesomeIcon icon={faGraduationCap} className="text-[10px]" />
            </span>
            กำหนดการ TCAS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-rose-100 text-rose-700">
              <FontAwesomeIcon icon={faLandmark} className="text-[10px]" />
            </span>
            วันหยุดราชการ
          </span>
        </div>

        {/* Calendar card */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => goToMonth(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"
              aria-label="เดือนก่อนหน้า"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className="flex items-center gap-2">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-[#003b73] outline-none"
              >
                {THAI_MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-[#003b73] outline-none"
              >
                {[2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    พ.ศ. {y + 543}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => goToMonth(1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"
              aria-label="เดือนถัดไป"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400">
            {THAI_WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) return <div key={idx} className="aspect-square" />;
              const events = eventsByDay.get(day) ?? [];
              const hasTcas = events.some((e) => e.type === "tcas");
              const hasHoliday = events.some((e) => e.type === "holiday");

              return (
                <div
                  key={idx}
                  className={`flex aspect-square flex-col items-center justify-start rounded-lg border p-1 text-xs ${
                    isToday(day)
                      ? "border-blue-400 bg-blue-50 font-extrabold text-blue-700"
                      : hasHoliday
                        ? "border-rose-100 bg-rose-50/60 text-gray-700"
                        : "border-gray-100 text-gray-700"
                  }`}
                  title={events.map((e) => e.title).join(" · ")}
                >
                  <span>{day}</span>
                  <div className="mt-0.5 flex gap-0.5">
                    {hasTcas && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                    {hasHoliday && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event list for the month */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-[#003b73]">
            เหตุการณ์เดือน{THAI_MONTH_NAMES[viewMonth - 1]} พ.ศ. {viewYear + 543}
          </h3>
          {monthEventList.length === 0 ? (
            <p className="text-xs text-gray-400">ไม่มีกำหนดการ TCAS หรือวันหยุดราชการในเดือนนี้</p>
          ) : (
            <div className="space-y-2">
              {monthEventList.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-50 bg-gray-50/50 p-2.5">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                      ev.type === "tcas" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    <FontAwesomeIcon icon={ev.type === "tcas" ? faGraduationCap : faLandmark} className="text-[10px]" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      วันที่ {ev.day} {THAI_MONTH_NAMES[viewMonth - 1]} — {ev.title}
                    </p>
                    {ev.description && <p className="mt-0.5 text-[11px] text-gray-500">{ev.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-800">
            <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 shrink-0" />
            <span>{LUNAR_HOLIDAY_NOTE}</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
