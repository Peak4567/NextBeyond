"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPlus,
  faFire,
  faMagnifyingGlass,
  faEye,
  faHeart,
  faTrophy,
  faComments,
  faLightbulb,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

interface PortfolioItem {
  id: number;
  title: string;
  student_name: string;
  school: string;
  faculty: string;
  university: string;
  views: string;
  likes: number;
  page_count: number;
  tags: string;
  cover_bg: string;
  cover_image: string | null;
}

interface DiscussionItem {
  id: number;
  title: string;
  author: string;
  replies: number;
  time_label: string;
}

export default function CommunityPage() {
  const router = useRouter();
  const [selectedFaculty, setSelectedFaculty] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [PORTFOLIOS, setPortfolios] = useState<PortfolioItem[]>([]);
  const [DISCUSSIONS, setDiscussions] = useState<DiscussionItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showThreadForm, setShowThreadForm] = useState(false);
  const [threadTitle, setThreadTitle] = useState("");
  const [threadError, setThreadError] = useState("");
  const [postingThread, setPostingThread] = useState(false);

  const FACULTIES = [
    "ทั้งหมด",
    "วิศวกรรมศาสตร์",
    "แพทยศาสตร์",
    "สถาปัตยกรรมศาสตร์",
    "บริหารธุรกิจ",
    "นิเทศศาสตร์",
    "วิทยาศาสตร์",
  ];

  useEffect(() => {
    const controller = new AbortController();

    async function loadCommunityContent() {
      try {
        const response = await fetch("/api/content/community", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load community content");

        const data = await response.json();
        setPortfolios(data.portfolios);
        setDiscussions(data.discussions);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setPortfolios([]);
          setDiscussions([]);
        }
      }
    }

    loadCommunityContent();
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(Boolean(data.user)))
      .catch(() => setIsLoggedIn(false));

    return () => controller.abort();
  }, []);

  async function handleCreateThread(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!threadTitle.trim()) return;

    setPostingThread(true);
    setThreadError("");
    const res = await fetch("/api/community/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: threadTitle }),
    });
    const data = await res.json();

    if (!res.ok) {
      setThreadError(data.error || "ตั้งกระทู้ไม่สำเร็จ");
    } else {
      setDiscussions(data.discussions);
      setThreadTitle("");
      setShowThreadForm(false);
    }
    setPostingThread(false);
  }

  const topPortfolios = [...PORTFOLIOS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  const searchTerm = searchQuery.trim().toLowerCase();
  const filteredPortfolios = PORTFOLIOS.filter((item) => {
    const matchesFaculty = selectedFaculty === "ทั้งหมด" || item.faculty === selectedFaculty;
    const matchesSearch =
      !searchTerm ||
      [item.title, item.university, item.school, item.student_name, item.tags]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);
    return matchesFaculty && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-1 text-xs font-bold text-[#005a9c]">
              <FontAwesomeIcon icon={faUsers} /> Student Community
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-[#003b73] sm:text-4xl">
              ชุมชนแลกเปลี่ยนผลงาน Portfolio
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              แรงบันดาลใจจากรุ่นพี่และเพื่อนๆ ที่สอบติดจริง พร้อมคลังตัวอย่างเล่มพอร์ตกว่า 1,000+ เล่ม
            </p>
          </div>

          <Link
            href="/profile"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#005a9c] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#003b73]"
          >
            <FontAwesomeIcon icon={faPlus} />
            อัปโหลดเล่มของคุณ
          </Link>
        </div>

        {/* --- BANNER NEW FEATURE: TCASFolio --- */}
        <div
          className="relative mb-10 overflow-hidden rounded-xl bg-[#003b73] bg-cover bg-center p-6 text-white shadow-lg sm:p-8"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#003b73]/95 via-[#003b73]/85 to-[#005a9c]/60" />
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="rounded-md bg-[#fcd116] px-2.5 py-1 text-[11px] font-extrabold text-[#003b73] uppercase tracking-wider">
                ระบบใหม่ล่าสุด <FontAwesomeIcon icon={faFire} />
              </span>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                TCASFolio - AI ตรวจสอบโครงสร้างเล่ม Portfolio
              </h2>
              <p className="mt-2 text-xs text-white/90 sm:text-sm leading-relaxed">
                ระบบวิเคราะห์เล่มพอร์ตอัจฉริยะ ตรวจเช็กจำนวนหน้า (ไม่เกิน 10 หน้าตามเกณฑ์ MyTCAS), ความครบถ้วนของประวัติ, กิจกรรม และคำนวณโอกาสติดของคณะเป้าหมายอัตโนมัติ
              </p>
              
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> ตรวจเช็กตามเกณฑ์ TCAS68
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> แนะนำจุดควรรอบคอบ
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" /> Export เป็น PDF พร้อมยื่น
                </span>
              </div>
            </div>

            <a
              href="https://www.mytcas.com"
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap rounded-xl bg-[#fcd116] px-6 py-3.5 text-sm font-extrabold text-[#003b73] shadow-md transition-all hover:bg-yellow-300 hover:scale-105"
            >
              ลองใช้ TCASFolio ฟรี ➔
            </a>
          </div>
        </div>


        {/* --- GRID CONTENT & SIDEBAR --- */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* ================= LEFT MAIN AREA (Col 8) ================= */}
          <div className="space-y-6 lg:col-span-8">
            
            {/* SEARCH & FACULTY FILTER BAR */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อผลงาน, มหาวิทยาลัย, กิจกรรม หรือโรงเรียน..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs text-gray-700 outline-none transition-all focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Faculty Categories Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {FACULTIES.map((fac) => (
                  <button
                    key={fac}
                    onClick={() => setSelectedFaculty(fac)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      selectedFaculty === fac
                        ? "bg-[#005a9c] text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {fac}
                  </button>
                ))}
              </div>
            </div>

            {/* PORTFOLIO CARDS GRID — แสดงผลเป็นเล่ม Portfolio ปกกระดาษ A4 */}
            {filteredPortfolios.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-300">
                  <FontAwesomeIcon icon={faFolderOpen} />
                </span>
                <h3 className="mt-4 text-sm font-bold text-gray-700">
                  {PORTFOLIOS.length === 0
                    ? "ตอนนี้ยังไม่มีผลงาน Portfolio ในระบบ"
                    : "ไม่พบผลงานที่ตรงกับตัวกรองที่เลือก"}
                </h3>
                <p className="mt-1.5 max-w-sm text-xs text-gray-400">
                  {PORTFOLIOS.length === 0
                    ? "เมื่อมีรุ่นพี่อัปโหลดเล่ม Portfolio และผ่านการอนุมัติแล้ว ผลงานจะแสดงขึ้นที่นี่โดยอัตโนมัติ"
                    : "ลองเปลี่ยนคำค้นหา หรือเลือกคณะอื่นดูนะ"}
                </p>
              </div>
            ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filteredPortfolios.map((item) => (
                <div key={item.id} className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  {/* ปกกระดาษ A4 พร้อมเอฟเฟกต์เงาเล่มหนา */}
                  <div className="relative w-24 shrink-0 sm:w-28">
                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md bg-gray-300/70 aspect-[210/297]" />
                    <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-md border border-gray-200 bg-gray-100 aspect-[210/297]" />
                    <div
                      className={`relative flex aspect-[210/297] w-full flex-col justify-end overflow-hidden rounded-md border border-gray-200 p-2.5 text-white shadow-lg ${
                        item.cover_image ? "" : `bg-gradient-to-br ${item.cover_bg}`
                      }`}
                    >
                      {item.cover_image && (
                        <img
                          src={item.cover_image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className="absolute top-2 right-2 z-10 rounded bg-black/50 px-1.5 py-0.5 text-[8px] font-bold backdrop-blur-sm">
                        {item.page_count} หน้า
                      </span>
                      <div className="relative z-10">
                        <span className="text-[8px] font-bold text-white/80 uppercase leading-tight">{item.university}</span>
                        <h4 className="text-[10px] font-extrabold leading-snug line-clamp-2">{item.faculty}</h4>
                      </div>
                    </div>
                    <span className="mt-1.5 block text-center text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                      A4 Portfolio
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    {/* Meta info */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#005a9c]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                        {item.student_name} • <span className="text-gray-400 font-normal">{item.school}</span>
                      </p>

                      {/* Tags */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {item.tags.split(",").map((tag, i) => (
                          <span key={i} className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Statistics */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 text-[11px] text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faEye} /> {item.views}
                        </span>
                        <span className="flex items-center gap-1 text-rose-500 font-medium">
                          <FontAwesomeIcon icon={faHeart} /> {item.likes}
                        </span>
                      </div>
                      <Link href={`/community-students/${item.id}`} className="font-bold text-[#005a9c] hover:underline">
                        เปิดดูเล่ม ➔
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

          </div>


          {/* ================= RIGHT SIDEBAR (Col 4) ================= */}
          <div className="space-y-6 lg:col-span-4">
            
            {/* 1. Leaderboard พอร์ตยอดนิยม */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#003b73] flex items-center gap-2">
                  <FontAwesomeIcon icon={faTrophy} className="text-amber-500" /> พอร์ตติดท็อปสัปดาห์นี้
                </h3>
                <span className="text-[10px] font-bold text-gray-400">Weekly Top</span>
              </div>

              <div className="mt-3 space-y-3">
                {topPortfolios.length === 0 ? (
                  <p className="py-4 text-center text-xs text-gray-400">ยังไม่มีผลงานให้จัดอันดับตอนนี้</p>
                ) : (
                  topPortfolios.map((item, index) => (
                    <Link
                      href={`/community-students/${item.id}`}
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50"
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black ${
                        index === 0 ? "bg-amber-100 text-amber-700" : index === 1 ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-bold text-gray-800 truncate">{item.title}</h4>
                        <p className="text-[10px] text-gray-400">{item.student_name}</p>
                      </div>
                      <span className="text-[10px] font-bold text-rose-500">
                        <FontAwesomeIcon icon={faHeart} /> {item.likes}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* 2. ฟอรัมพูดคุย & ถามตอบ */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#003b73]">
                  <FontAwesomeIcon icon={faComments} className="text-blue-500" /> พูดคุยเรื่อง Portfolio
                </h3>
                <button
                  onClick={() => setShowThreadForm((prev) => !prev)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  {showThreadForm ? "ยกเลิก" : "ตั้งกระทู้"}
                </button>
              </div>

              {showThreadForm && (
                <form onSubmit={handleCreateThread} className="mt-3 space-y-2 border-b border-gray-100 pb-3">
                  <input
                    type="text"
                    value={threadTitle}
                    onChange={(e) => setThreadTitle(e.target.value)}
                    placeholder={isLoggedIn ? "หัวข้อกระทู้ของคุณ..." : "เข้าสู่ระบบเพื่อตั้งกระทู้"}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                  {threadError && <p className="text-[11px] font-semibold text-red-600">{threadError}</p>}
                  <button
                    type="submit"
                    disabled={postingThread}
                    className="w-full rounded-xl bg-[#005a9c] py-2 text-xs font-bold text-white hover:bg-[#003b73] disabled:opacity-60"
                  >
                    {postingThread ? "กำลังตั้งกระทู้..." : "ตั้งกระทู้"}
                  </button>
                </form>
              )}

              <div className="mt-3 space-y-3">
                {DISCUSSIONS.map((topic) => (
                  <div key={topic.id} className="border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-gray-700 hover:text-blue-600 cursor-pointer line-clamp-1">
                      {topic.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400">
                      <span>โดย {topic.author}</span>
                      <span><FontAwesomeIcon icon={faComments} /> {topic.replies} ตอบ • {topic.time_label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. คำแนะนำสำหรับการยื่นพอร์ต */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
              <h4 className="text-xs font-extrabold text-[#003b73]">
                <FontAwesomeIcon icon={faLightbulb} className="text-amber-400" /> ข้อควรระวังในการยื่น Portfolio
              </h4>
              <ul className="mt-2 space-y-1.5 text-[11px] text-gray-600 list-disc list-inside">
                <li>ขนาดไฟล์ PDF ต้องไม่เกินที่ระบบ TCAS กำหนด (ส่วนใหญ่ 10-20 MB)</li>
                <li>ห้ามใส่ข้อมูลเท็จ หรือปลอมแปลงเกียรติบัตรเด็ดขาด</li>
                <li>เช็กฟอนต์และระยะขอบกระดาษให้อ่านง่าย</li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}