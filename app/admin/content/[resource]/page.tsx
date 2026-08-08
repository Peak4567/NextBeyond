"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faPlus,
  faTrash,
  faPenToSquare,
  faCircleExclamation,
  faCloudArrowDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { ADMIN_RESOURCES } from "@/lib/adminResources";
import { confirmDelete, confirmWarning, notifySuccess, notifyError } from "@/lib/sweetalert";

type Row = Record<string, string | number | null>;

const UPLOAD_FOLDER_BY_RESOURCE: Record<string, string> = {
  news: "news",
  portfolios: "portfolios",
};

export default function AdminResourcePage() {
  const params = useParams<{ resource: string }>();
  const resource = params.resource;
  const config = ADMIN_RESOURCES[resource];

  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  async function loadItems(targetPage = page) {
    setLoading(true);
    const res = await fetch(`/api/admin/${resource}?page=${targetPage}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setPage(data.page ?? targetPage);
    setLoading(false);
  }

  useEffect(() => {
    if (config) loadItems(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  async function handleSync() {
    if (!config.syncAction) return;
    const confirmed = await confirmWarning({
      title: config.syncAction.confirmTitle,
      text: config.syncAction.confirmText,
      confirmText: "เริ่มซิงค์ข้อมูล",
    });
    if (!confirmed) return;

    setSyncing(true);
    const res = await fetch(config.syncAction.endpoint, { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      notifyError("ซิงค์ข้อมูลไม่สำเร็จ", data.error);
    } else {
      notifySuccess(
        "ซิงค์ข้อมูลสำเร็จ",
        `นำเข้า ${data.totalCriteria ?? data.totalPrograms ?? ""} รายการ จาก ${data.totalPrograms ?? "-"} หลักสูตร`
      );
      await loadItems(1);
    }
    setSyncing(false);
  }

  if (!config) {
    return <p className="text-sm text-gray-500">ไม่พบประเภทข้อมูลนี้</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/admin/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "เพิ่มข้อมูลไม่สำเร็จ");
      notifyError("เพิ่มข้อมูลไม่สำเร็จ", data.error);
    } else {
      setForm({});
      await loadItems();
      notifySuccess("เพิ่มข้อมูลเรียบร้อยแล้ว");
    }
    setSubmitting(false);
  }

  async function handleDelete(id: number) {
    const confirmed = await confirmDelete({
      title: "ยืนยันการลบรายการนี้?",
      text: `รายการนี้จะถูกลบออกจาก "${config.label}" ทันที และไม่สามารถกู้คืนได้`,
    });
    if (!confirmed) return;

    await fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" });
    await loadItems();
    notifySuccess("ลบข้อมูลเรียบร้อยแล้ว");
  }

  async function handleImageUpload(fieldKey: string, file: File) {
    setUploadingField(fieldKey);
    setError("");

    const body = new FormData();
    body.append("file", file);
    body.append("folder", UPLOAD_FOLDER_BY_RESOURCE[resource] ?? "general");

    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "อัปโหลดรูปภาพไม่สำเร็จ");
    } else {
      setForm((prev) => ({ ...prev, [fieldKey]: data.url }));
    }
    setUploadingField(null);
  }

  return (
    <div>
      <Link
        href="/admin/content"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <FontAwesomeIcon icon={faArrowLeftLong} />
        กลับไปหน้ารายการเนื้อหา
      </Link>
      <h1 className="mt-2 flex items-center gap-2.5 text-xl font-extrabold text-[#003b73] sm:text-2xl">
        <FontAwesomeIcon icon={config.icon} className="text-[#005a9c]" />
        {config.label}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{config.description}</p>

      {config.syncAction && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-[#003b73]">ดึงข้อมูลจริงจากเว็บไซต์ TCAS70</p>
            <p className="mt-0.5 text-[11px] text-gray-500">
              นำเข้าเกณฑ์การรับสมัครทุกคณะทุกสาขาจาก mytcas.com โดยตรง แทนที่ข้อมูลเดิมทั้งหมด
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#004b8d] px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-[#002b55] disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faCloudArrowDown} />
            {syncing ? "กำลังซิงค์ข้อมูล..." : config.syncAction.label}
          </button>
        </div>
      )}

      {/* Add form */}
      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold text-[#003b73]">เพิ่มข้อมูลใหม่</h2>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
            <FontAwesomeIcon icon={faCircleExclamation} />
            {error}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              <label className="mb-1 block text-xs font-bold text-gray-700">{field.label}</label>

              {field.type === "textarea" ? (
                <textarea
                  value={(form[field.key] as string) ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              ) : field.type === "select" ? (
                <select
                  value={(form[field.key] as string) ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="">— เลือก —</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.key])}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              ) : field.type === "image" ? (
                <div className="flex items-center gap-3">
                  {form[field.key] ? (
                    <img
                      src={form[field.key] as string}
                      alt=""
                      className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(field.key, file);
                    }}
                    className="w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-700"
                  />
                  {uploadingField === field.key && (
                    <span className="text-[10px] text-gray-400">กำลังอัปโหลด...</span>
                  )}
                </div>
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={(form[field.key] as string) ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 flex items-center gap-2 rounded-xl bg-[#002b55] px-6 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-[#004b8d] disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faPlus} />
          {submitting ? "กำลังเพิ่ม..." : "เพิ่มข้อมูล"}
        </button>
      </form>

      {/* List */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500">
            <tr>
              {config.fields.map((field) => (
                <th key={field.key} className="whitespace-nowrap px-4 py-3">
                  {field.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={config.fields.length + 1} className="px-4 py-8 text-center text-xs text-gray-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={config.fields.length + 1} className="px-4 py-8 text-center text-xs text-gray-400">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id as number} className="border-b border-gray-50 last:border-0">
                  {config.fields.map((field) => (
                    <td key={field.key} className="max-w-xs truncate px-4 py-3 text-xs text-gray-700">
                      {field.type === "checkbox" ? (
                        item[field.key] ? "✔" : "—"
                      ) : field.type === "image" && item[field.key] ? (
                        <img
                          src={String(item[field.key])}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        String(item[field.key] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {config.detailLinkBase && (
                        <Link
                          href={`${config.detailLinkBase}/${item.id}`}
                          className="flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-blue-600 hover:underline"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                          {config.detailLinkLabel ?? "แก้ไข"}
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(item.id as number)}
                        className="flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-red-500 hover:underline"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-gray-400">
            แสดง {items.length === 0 ? 0 : (page - 1) * pageSize + 1}–{(page - 1) * pageSize + items.length} จากทั้งหมด {total.toLocaleString("th-TH")} รายการ
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadItems(page - 1)}
              disabled={page <= 1 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-[11px]" />
            </button>
            <span className="text-xs font-semibold text-gray-600">
              หน้า {page} / {totalPages}
            </span>
            <button
              onClick={() => loadItems(page + 1)}
              disabled={page >= totalPages || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-[11px]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
