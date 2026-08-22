"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserShield,
  faUser,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { confirmWarning, notifySuccess, notifyError } from "@/lib/sweetalert";

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "member";
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateRole(id: number, role: "admin" | "member") {
    const confirmed = await confirmWarning({
      title: role === "admin" ? "ยืนยันการเลื่อนเป็นแอดมิน?" : "ยืนยันการปลดสิทธิ์แอดมิน?",
      text:
        role === "admin"
          ? "ผู้ใช้นี้จะสามารถเข้าถึงระบบหลังบ้านได้ทันที"
          : "ผู้ใช้นี้จะไม่สามารถเข้าถึงระบบหลังบ้านได้อีก",
      confirmText: "ยืนยัน",
    });
    if (!confirmed) return;

    setSavingId(id);
    setMessage("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "เปลี่ยนตำแหน่งไม่สำเร็จ");
      notifyError("เปลี่ยนตำแหน่งไม่สำเร็จ", data.error);
    } else {
      await loadUsers();
      notifySuccess("เปลี่ยนตำแหน่งผู้ใช้งานแล้ว");
    }
    setSavingId(null);
  }

  return (
    <div>
      <h1 className="flex items-center gap-2.5 text-xl font-extrabold text-[#003b73] sm:text-2xl">
        <FontAwesomeIcon icon={faUsers} className="text-[#005a9c]" />
        จัดการผู้ใช้งาน
      </h1>
      <p className="mt-1 text-sm text-gray-500">เปลี่ยนตำแหน่งผู้ใช้งานระหว่าง admin และ member</p>

      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
          <FontAwesomeIcon icon={faCircleExclamation} />
          {message}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500">
            <tr>
              <th className="px-5 py-3">ชื่อ-นามสกุล</th>
              <th className="px-5 py-3">อีเมล</th>
              <th className="px-5 py-3">ตำแหน่ง</th>
              <th className="px-5 py-3">สมัครเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-xs text-gray-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-xs text-gray-400">
                  ไม่พบผู้ใช้งาน
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-semibold text-gray-800">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                          u.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-[#1e3a8a]"
                        }`}
                      >
                        <FontAwesomeIcon icon={u.role === "admin" ? faUserShield : faUser} />
                      </span>
                      <span className="truncate">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      disabled={savingId === u.id}
                      onChange={(e) => updateRole(u.id, e.target.value as "admin" | "member")}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("th-TH")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
