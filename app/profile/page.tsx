"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faFloppyDisk,
  faCloudArrowUp,
  faHeart,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { confirmSave, notifySuccess, notifyError } from "@/lib/sweetalert";

interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "member";
}

interface MyPortfolio {
  id: number;
  title: string;
  faculty: string;
  university: string;
  status: "pending" | "approved" | "rejected";
  likes: number;
  page_count: number;
  createdAt: string;
}

const STATUS_LABELS: Record<MyPortfolio["status"], { label: string; className: string }> = {
  pending: { label: "รออนุมัติ", className: "bg-amber-100 text-amber-700" },
  approved: { label: "อนุมัติแล้ว", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "ถูกปฏิเสธ", className: "bg-red-100 text-red-600" },
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [portfolios, setPortfolios] = useState<MyPortfolio[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

  const [title, setTitle] = useState("");
  const [faculty, setFaculty] = useState("");
  const [university, setUniversity] = useState("");
  const [school, setSchool] = useState("");
  const [tags, setTags] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [preparingPdf, setPreparingPdf] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  // เปิดไฟล์ PDF ที่เลือกด้วย pdf.js ฝั่งเบราว์เซอร์ เพื่อ render หน้าแรกเป็นรูปหน้าปก และนับจำนวนหน้าทั้งเล่ม
  async function handlePdfSelect(file: File | null) {
    setPdfFile(file);
    setCoverPreview("");
    setCoverBlob(null);
    setPageCount(0);
    setUploadError("");
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("กรุณาเลือกไฟล์ PDF เท่านั้น");
      setPdfFile(null);
      return;
    }

    setPreparingPdf(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await withTimeout(pdfjsLib.getDocument({ data: arrayBuffer }).promise, 20000);
      setPageCount(pdf.numPages);

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (context) {
        // page.render() ใช้ requestAnimationFrame ภายใน ถ้าแท็บถูกซ่อน/สลับไปแท็บอื่นระหว่างรอ
        // เบราว์เซอร์จะหน่วง rAF จนค้างไม่จบ ใส่ timeout กันไว้เพื่อไม่ให้ค้างตลอดไป
        await withTimeout(page.render({ canvasContext: context, viewport }).promise, 20000);
        const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (blob) {
          setCoverBlob(blob);
          setCoverPreview(URL.createObjectURL(blob));
        }
      }
    } catch {
      setUploadError(
        "ไม่สามารถอ่านไฟล์ PDF นี้ได้ (ไฟล์อาจเสียหาย ไม่ใช่ไฟล์ PDF ที่ถูกต้อง หรือแท็บถูกสลับไปหน้าอื่นระหว่างประมวลผล — ลองใหม่โดยไม่สลับแท็บระหว่างรอ)"
      );
      setPdfFile(null);
    } finally {
      setPreparingPdf(false);
    }
  }

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        if (data.user) {
          setFullName(data.user.fullName);
          setEmail(data.user.email);
        } else {
          router.push("/login");
        }
      });
  }, [router]);

  async function loadMyPortfolios() {
    setLoadingPortfolios(true);
    const res = await fetch("/api/portfolio/mine");
    const data = await res.json();
    setPortfolios(data.portfolios ?? []);
    setLoadingPortfolios(false);
  }

  useEffect(() => {
    if (user) loadMyPortfolios();
  }, [user]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();

    const confirmed = await confirmSave({
      title: "ยืนยันการบันทึกข้อมูลส่วนตัว?",
      text: "ชื่อและอีเมลของคุณจะถูกอัปเดตทันที",
    });
    if (!confirmed) return;

    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setProfileError(data.error || "บันทึกไม่สำเร็จ");
      notifyError("บันทึกไม่สำเร็จ", data.error);
    } else {
      setProfileSuccess("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");
      setUser(data.user);
      notifySuccess("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");
    }
    setSavingProfile(false);
  }

  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess("");

    if (!pdfFile) {
      setUploadError("กรุณาเลือกไฟล์ PDF เล่มผลงาน");
      return;
    }

    setUploading(true);
    const body = new FormData();
    body.append("title", title);
    body.append("faculty", faculty);
    body.append("university", university);
    body.append("school", school);
    body.append("tags", tags);
    body.append("pdf", pdfFile);
    body.append("pageCount", String(pageCount || 1));
    if (coverBlob) body.append("cover", coverBlob, "cover.png");

    const res = await fetch("/api/portfolio", { method: "POST", body });
    const data = await res.json();

    if (!res.ok) {
      setUploadError(data.error || "อัปโหลดไม่สำเร็จ");
    } else {
      setUploadSuccess("อัปโหลดเล่มผลงานสำเร็จ รอแอดมินตรวจสอบและอนุมัติ");
      setTitle("");
      setFaculty("");
      setUniversity("");
      setSchool("");
      setTags("");
      setPdfFile(null);
      setCoverPreview("");
      setCoverBlob(null);
      setPageCount(0);
      await loadMyPortfolios();
    }
    setUploading(false);
  }

  if (user === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-sm text-gray-400">
          กำลังโหลด...
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 lg:px-8">
        <h1 className="text-2xl font-extrabold text-[#003b73] sm:text-3xl">โปรไฟล์ของฉัน</h1>
        <p className="mt-1 text-sm text-gray-500">แก้ไขข้อมูลส่วนตัว และอัปโหลดเล่มผลงาน Portfolio ของคุณ</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Edit Profile */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#003b73]">ข้อมูลส่วนตัว</h2>

            {profileError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-600">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">ชื่อ-นามสกุล</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700">อีเมล</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 rounded-xl bg-[#002b55] px-6 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-[#004b8d] disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {savingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </form>
          </div>

          {/* Upload Portfolio */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#003b73]">อัปโหลดเล่มผลงาน Portfolio</h2>
            <p className="mt-1 text-xs text-gray-400">
              เล่มที่อัปโหลดจะมีสถานะ &quot;รออนุมัติ&quot; จนกว่าแอดมินจะตรวจสอบและอนุมัติให้แสดงในหน้าชุมชนนักเรียน
            </p>

            {uploadError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-600">
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ชื่อผลงาน เช่น Portfolio ติดวิศวะ คอมฯ"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="คณะ"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                />
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="มหาวิทยาลัย"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="โรงเรียน"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="แท็ก (คั่นด้วย , เช่น Software, GPAX 3.95)"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
              />

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-gray-700">
                  <FontAwesomeIcon icon={faFilePdf} /> ไฟล์ PDF เล่มผลงาน
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handlePdfSelect(e.target.files?.[0] ?? null)}
                  className="w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-700"
                />
                {preparingPdf && (
                  <p className="mt-2 text-[11px] text-gray-400">กำลังอ่านไฟล์ PDF และสร้างรูปหน้าปก...</p>
                )}
                {coverPreview && !preparingPdf && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={coverPreview}
                      alt="ตัวอย่างหน้าปก"
                      className="h-24 w-auto rounded-md border border-gray-200 object-contain shadow-sm"
                    />
                    <p className="text-[11px] text-gray-500">
                      หน้าปก (ดึงจากหน้าแรกของ PDF อัตโนมัติ)
                      <br />
                      ทั้งหมด {pageCount} หน้า
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || preparingPdf || !pdfFile}
                className="flex items-center gap-2 rounded-xl bg-[#002b55] px-6 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-[#004b8d] disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faCloudArrowUp} />
                {uploading ? "กำลังอัปโหลด..." : "อัปโหลดเล่มผลงาน"}
              </button>
            </form>
          </div>
        </div>

        {/* My Portfolios */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#003b73]">เล่มผลงานของฉัน</h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-500">
                <tr>
                  <th className="py-2">ชื่อผลงาน</th>
                  <th className="py-2">คณะ/มหาวิทยาลัย</th>
                  <th className="py-2">สถานะ</th>
                  <th className="py-2">ไลก์</th>
                </tr>
              </thead>
              <tbody>
                {loadingPortfolios ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                ) : portfolios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                      คุณยังไม่ได้อัปโหลดเล่มผลงาน
                    </td>
                  </tr>
                ) : (
                  portfolios.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 text-xs font-semibold text-gray-800">{p.title}</td>
                      <td className="py-3 text-xs text-gray-500">{p.faculty} • {p.university}</td>
                      <td className="py-3">
                        <span className={`rounded-xl px-2.5 py-0.5 text-[10px] font-bold ${STATUS_LABELS[p.status].className}`}>
                          {STATUS_LABELS[p.status].label}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        <FontAwesomeIcon icon={faHeart} className="text-rose-400" /> {p.likes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
