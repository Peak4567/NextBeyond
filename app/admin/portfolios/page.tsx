"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleCheck,
  faCheck,
  faXmark,
  faFilePdf,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { confirmSave, confirmDelete, notifySuccess, notifyError } from "@/lib/sweetalert";

interface PendingPortfolio {
  id: number;
  title: string;
  studentName: string;
  faculty: string;
  university: string;
  status: "pending";
  createdAt: string;
  pageCount: number;
  pdfPath: string | null;
  coverImage: string | null;
}

export default function AdminPortfoliosPage() {
  const [items, setItems] = useState<PendingPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadPending() {
    setLoading(true);
    const res = await fetch("/api/admin/portfolios/pending");
    const data = await res.json();
    setItems(data.portfolios ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleDecision(id: number, status: "approved" | "rejected") {
    const confirmed =
      status === "approved"
        ? await confirmSave({
            title: "ยืนยันการอนุมัติเล่มนี้?",
            text: "เล่มผลงานจะแสดงในหน้าชุมชนนักเรียนทันที",
            confirmText: "อนุมัติ",
          })
        : await confirmDelete({
            title: "ยืนยันการปฏิเสธเล่มนี้?",
            text: "เล่มผลงานนี้จะไม่ถูกแสดงในหน้าชุมชนนักเรียน",
            confirmText: "ปฏิเสธ",
          });
    if (!confirmed) return;

    setBusyId(id);
    const res = await fetch(`/api/admin/portfolios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      notifyError(data.error || "ดำเนินการไม่สำเร็จ");
    } else {
      await loadPending();
      notifySuccess(status === "approved" ? "อนุมัติเล่มผลงานแล้ว" : "ปฏิเสธเล่มผลงานแล้ว");
    }
    setBusyId(null);
  }

  return (
    <div>
      <h1 className="flex items-center gap-2.5 text-xl font-extrabold text-[#003b73] sm:text-2xl">
        <FontAwesomeIcon icon={faFileCircleCheck} className="text-[#005a9c]" />
        อนุมัติเล่มผลงาน Portfolio
      </h1>
      <p className="mt-1 text-sm text-gray-500">ตรวจสอบและอนุมัติเล่มผลงานที่นักเรียนอัปโหลดก่อนแสดงในหน้าชุมชนนักเรียน</p>

      {loading ? (
        <p className="mt-8 text-center text-xs text-gray-400">กำลังโหลดข้อมูล...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-center text-xs text-gray-400">ไม่มีเล่มผลงานที่รออนุมัติ</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              {item.coverImage ? (
                <img src={item.coverImage} alt="" className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                  ไม่มีรูปภาพ
                </div>
              )}
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  {item.studentName}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">{item.faculty} • {item.university}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
                  <FontAwesomeIcon icon={faFilePdf} />
                  {item.pageCount} หน้า
                </p>
                {item.pdfPath && (
                  <a
                    href={item.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <FontAwesomeIcon icon={faFilePdf} />
                    เปิดดูไฟล์ PDF ก่อนอนุมัติ
                  </a>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleDecision(item.id, "approved")}
                    disabled={busyId === item.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => handleDecision(item.id, "rejected")}
                    disabled={busyId === item.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                    ปฏิเสธ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
