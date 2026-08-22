"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faNewspaper,
  faPlus,
  faImage,
  faArrowUp,
  faArrowDown,
  faTrash,
  faFloppyDisk,
  faBold,
  faItalic,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { confirmDelete, confirmSave, notifySuccess, notifyError } from "@/lib/sweetalert";

interface NewsBlock {
  id: number;
  block_type: "text" | "image";
  text_content: string | null;
  image_path: string | null;
  is_bold: number;
  is_italic: number;
  sort_order: number;
}

export default function NewsBlockEditorPage() {
  const params = useParams<{ id: string }>();
  const articleId = params.id;

  const [blocks, setBlocks] = useState<NewsBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [newBold, setNewBold] = useState(false);
  const [newItalic, setNewItalic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function loadBlocks() {
    setLoading(true);
    const res = await fetch(`/api/admin/news/${articleId}/blocks`);
    const data = await res.json();
    setBlocks(data.blocks ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  async function handleAddText(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;

    await fetch(`/api/admin/news/${articleId}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockType: "text", textContent: newText, isBold: newBold, isItalic: newItalic }),
    });
    setNewText("");
    setNewBold(false);
    setNewItalic(false);
    await loadBlocks();
    notifySuccess("เพิ่มบล็อกข้อความแล้ว");
  }

  async function handleAddImage(file: File) {
    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);
    body.append("folder", "news");
    const uploadRes = await fetch("/api/admin/upload", { method: "POST", body });
    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      setError(uploadData.error || "อัปโหลดรูปไม่สำเร็จ");
      notifyError("อัปโหลดรูปไม่สำเร็จ", uploadData.error);
      setUploading(false);
      return;
    }

    await fetch(`/api/admin/news/${articleId}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockType: "image", imagePath: uploadData.url }),
    });
    await loadBlocks();
    notifySuccess("เพิ่มบล็อกรูปภาพแล้ว");
    setUploading(false);
  }

  async function handleUpdateText(block: NewsBlock, textContent: string, isBold: boolean, isItalic: boolean) {
    const confirmed = await confirmSave({
      title: "บันทึกการแก้ไขบล็อกนี้?",
      text: "ข้อความที่แสดงในหน้าอ่านข่าวจะถูกอัปเดตทันที",
    });
    if (!confirmed) return;

    await fetch(`/api/admin/news/blocks/${block.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textContent, isBold, isItalic }),
    });
    await loadBlocks();
    notifySuccess("บันทึกบล็อกเรียบร้อยแล้ว");
  }

  async function handleDelete(blockId: number) {
    const confirmed = await confirmDelete({
      title: "ยืนยันการลบบล็อกนี้?",
      text: "บล็อกนี้จะหายไปจากหน้าอ่านข่าวทันที",
    });
    if (!confirmed) return;

    await fetch(`/api/admin/news/blocks/${blockId}`, { method: "DELETE" });
    await loadBlocks();
    notifySuccess("ลบบล็อกเรียบร้อยแล้ว");
  }

  async function handleMove(blockId: number, direction: "up" | "down") {
    await fetch(`/api/admin/news/blocks/${blockId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    await loadBlocks();
  }

  return (
    <div>
      <Link
        href="/admin/content/news"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <FontAwesomeIcon icon={faArrowLeftLong} />
        กลับไปหน้ารายการข่าว
      </Link>
      <h1 className="mt-2 flex items-center gap-2.5 text-xl font-extrabold text-[#003b73] sm:text-2xl">
        <FontAwesomeIcon icon={faNewspaper} className="text-[#005a9c]" />
        แก้ไขเนื้อหาข่าว
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        เพิ่มบล็อกข้อความหรือรูปภาพได้ไม่จำกัด เรียงลำดับได้อิสระ — ลำดับบล็อกจะเป็นลำดับการแสดงผลจริงในหน้าอ่านข่าว
      </p>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
          <FontAwesomeIcon icon={faCircleExclamation} />
          {error}
        </div>
      )}

      {/* Add block controls */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form onSubmit={handleAddText} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-bold text-[#003b73]">เพิ่มบล็อกข้อความ</h2>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            placeholder="พิมพ์ข้อความ..."
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
          />
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={newBold} onChange={(e) => setNewBold(e.target.checked)} />
              <FontAwesomeIcon icon={faBold} className="text-gray-400" />
              ตัวหนา
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={newItalic} onChange={(e) => setNewItalic(e.target.checked)} />
              <FontAwesomeIcon icon={faItalic} className="text-gray-400" />
              ตัวเอียง
            </label>
          </div>
          <button
            type="submit"
            className="mt-3 flex items-center gap-2 rounded-xl bg-[#002b55] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#004b8d]"
          >
            <FontAwesomeIcon icon={faPlus} />
            เพิ่มบล็อกข้อความ
          </button>
        </form>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xs font-bold text-[#003b73]">
            <FontAwesomeIcon icon={faImage} />
            เพิ่มบล็อกรูปภาพ
          </h2>
          <p className="mt-1 text-[11px] text-gray-400">อัปโหลดรูปได้ไม่จำกัดจำนวน</p>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAddImage(file);
            }}
            className="mt-3 w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-700"
          />
          {uploading && <p className="mt-2 text-[11px] text-gray-400">กำลังอัปโหลด...</p>}
        </div>
      </div>

      {/* Block list */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-center text-xs text-gray-400">กำลังโหลดข้อมูล...</p>
        ) : blocks.length === 0 ? (
          <p className="text-center text-xs text-gray-400">ยังไม่มีเนื้อหาในข่าวนี้</p>
        ) : (
          blocks.map((block, index) => (
            <div key={block.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase text-gray-400">
                  บล็อกที่ {index + 1} • {block.block_type === "text" ? "ข้อความ" : "รูปภาพ"}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => handleMove(block.id, "up")}
                    aria-label="เลื่อนขึ้น"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faArrowUp} />
                  </button>
                  <button
                    onClick={() => handleMove(block.id, "down")}
                    aria-label="เลื่อนลง"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faArrowDown} />
                  </button>
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="flex items-center gap-1.5 font-bold text-red-500 hover:underline"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    ลบ
                  </button>
                </div>
              </div>

              {block.block_type === "image" && block.image_path ? (
                <img src={block.image_path} alt="" className="mt-3 max-h-64 rounded-xl object-cover" />
              ) : (
                <TextBlockEditor block={block} onSave={handleUpdateText} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TextBlockEditor({
  block,
  onSave,
}: {
  block: NewsBlock;
  onSave: (block: NewsBlock, textContent: string, isBold: boolean, isItalic: boolean) => void;
}) {
  const [text, setText] = useState(block.text_content ?? "");
  const [bold, setBold] = useState(Boolean(block.is_bold));
  const [italic, setItalic] = useState(Boolean(block.is_italic));

  return (
    <div className="mt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className={`w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white ${bold ? "font-bold" : ""} ${italic ? "italic" : ""}`}
      />
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={bold} onChange={(e) => setBold(e.target.checked)} />
          <FontAwesomeIcon icon={faBold} className="text-gray-400" />
          ตัวหนา
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={italic} onChange={(e) => setItalic(e.target.checked)} />
          <FontAwesomeIcon icon={faItalic} className="text-gray-400" />
          ตัวเอียง
        </label>
        <button
          onClick={() => onSave(block, text, bold, italic)}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
          บันทึก
        </button>
      </div>
    </div>
  );
}
