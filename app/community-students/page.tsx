"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CommunityPage() {
  const [selectedFaculty, setSelectedFaculty] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  const FACULTIES = [
    "ทั้งหมด",
    "วิศวกรรมศาสตร์",
    "แพทยศาสตร์",
    "สถาปัตยกรรมศาสตร์",
    "บริหารธุรกิจ",
    "นิเทศศาสตร์",
    "วิทยาศาสตร์",
  ];

  const PORTFOLIOS = [
    {
      id: 1,
      title: "Portfolio ติดวิศวะ คอมฯ จุฬาฯ รอบ 1",
      student: "นายศรัณยกร เทพสุนทร",
      school: "โรงเรียนเตรียมอุดมศึกษา",
      faculty: "วิศวกรรมศาสตร์",
      university: "จุฬาลงกรณ์มหาวิทยาลัย",
      views: "2.4k",
      likes: 342,
      pageCount: 10,
      tags: ["Software", "Robot Project", "GPAX 3.95"],
      coverBg: "from-blue-600 to-indigo-800",
    },
    {
      id: 2,
      title: "พอร์ตสายแพทย์ มหิดล ผลงานจิตอาสาแน่นๆ",
      student: "นางสาวกัญญาณัฐ ศรีสุข",
      school: "โรงเรียนบดินทรเดชา",
      faculty: "แพทยศาสตร์",
      university: "มหาวิทยาลัยมหิดล",
      views: "4.1k",
      likes: 512,
      pageCount: 10,
      tags: ["วิจัยชีววิทยา", "สอวน.", "GPAX 4.00"],
      coverBg: "from-[#005a9c] to-teal-700",
    },
    {
      id: 3,
      title: "Portfolio สถาปัตย์ เกษตรศาสตร์ สายวาดอาร์ต",
      student: "นายภานุพงศ์ พงษ์ธนา",
      school: "โรงเรียนสวนกุหลาบวิทยาลัย",
      faculty: "สถาปัตยกรรมศาสตร์",
      university: "มหาวิทยาลัยเกษตรศาสตร์",
      views: "1.8k",
      likes: 210,
      pageCount: 10,
      tags: ["3D Model", "Sketch Design", "GPAX 3.75"],
      coverBg: "from-orange-500 to-[#e25a3a]",
    },
    {
      id: 4,
      title: "พอร์ตบริหารธุรกิจ ธรรมศาสตร์ (BBA)",
      student: "นายอัครวินท์ ชัยมงคล",
      school: "โรงเรียนสาธิต มศว",
      faculty: "บริหารธุรกิจ",
      university: "มหาวิทยาลัยธรรมศาสตร์",
      views: "1.2k",
      likes: 189,
      pageCount: 10,
      tags: ["Startup Competition", "IELTS 7.5"],
      coverBg: "from-amber-500 to-red-600",
    },
    {
      id: 5,
      title: "นิเทศฯ จุฬาฯ ผลงานกำกับหนังสั้น & ตัดต่อ",
      student: "นางสาวจิรัชญา แสนดี",
      school: "โรงเรียนมาแตร์เดอีวิทยาลัย",
      faculty: "นิเทศศาสตร์",
      university: "จุฬาลงกรณ์มหาวิทยาลัย",
      views: "3.5k",
      likes: 420,
      pageCount: 10,
      tags: ["Short Film", "Short Film Director"],
      coverBg: "from-purple-600 to-[#003b73]",
    },
    {
      id: 6,
      title: "พอร์ต Data Science ลาดกระบัง โครงการ AI",
      student: "นายธนกฤต อินทร์แก้ว",
      school: "โรงเรียนมหิดลวิทยานุสรณ์",
      faculty: "วิทยาศาสตร์",
      university: "สถาบันเทคโนโลยีพระจอมเกล้าฯ",
      views: "980",
      likes: 145,
      pageCount: 10,
      tags: ["Python", "Machine Learning"],
      coverBg: "from-cyan-600 to-blue-900",
    },
  ];

  const DISCUSSIONS = [
    { title: "ใส่เกียรติบัตรออนไลน์ Coursera มหาลัยรับไหมครับ?", author: "เด็ก68อยากติดหมอ", replies: 14, time: "10 นาทีที่แล้ว" },
    { title: "แจกพิกัดเว็บดึงสวอตช์สีทำพอร์ตสไตล์มินิมอลฟรี!", author: "PortfolioMaker", replies: 32, time: "1 ชม. ที่แล้ว" },
    { title: "หน้าโครงสร้างความสามารถพิเศษควรใส่กี่เปอร์เซ็นต์ดี?", author: "DekCom68", replies: 8, time: "3 ชม. ที่แล้ว" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-[#005a9c]">
              <span>👥 Student Community</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-[#003b73] sm:text-4xl">
              ชุมชนแลกเปลี่ยนผลงาน Portfolio
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              แรงบันดาลใจจากรุ่นพี่และเพื่อนๆ ที่สอบติดจริง พร้อมคลังตัวอย่างเล่มพอร์ตกว่า 1,000+ เล่ม
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-[#005a9c] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#003b73]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            อัปโหลดเล่มของคุณ
          </button>
        </div>

        {/* --- BANNER NEW FEATURE: TCASFolio --- */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#003b73] via-[#005a9c] to-[#71bbee] p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="rounded-md bg-[#fcd116] px-2.5 py-1 text-[11px] font-extrabold text-[#003b73] uppercase tracking-wider">
                ระบบใหม่ล่าสุด 🔥
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

            <button className="whitespace-nowrap rounded-2xl bg-[#fcd116] px-6 py-3.5 text-sm font-extrabold text-[#003b73] shadow-md transition-all hover:bg-yellow-300 hover:scale-105">
              ลองใช้ TCASFolio ฟรี ➔
            </button>
          </div>
        </div>


        {/* --- GRID CONTENT & SIDEBAR --- */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* ================= LEFT MAIN AREA (Col 8) ================= */}
          <div className="space-y-6 lg:col-span-8">
            
            {/* SEARCH & FACULTY FILTER BAR */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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

            {/* PORTFOLIO CARDS GRID */}
            <div className="grid gap-5 sm:grid-cols-2">
              {PORTFOLIOS.map((item) => (
                <div key={item.id} className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div>
                    {/* Mock Cover Preview */}
                    <div className={`relative flex h-40 w-full items-end rounded-xl bg-gradient-to-br ${item.coverBg} p-4 text-white shadow-inner`}>
                      <span className="absolute top-3 right-3 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                        {item.pageCount} หน้า (PDF)
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-white/80 uppercase">{item.university}</span>
                        <h4 className="text-xs font-extrabold line-clamp-1">{item.faculty}</h4>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="mt-3">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#005a9c]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                        {item.student} • <span className="text-gray-400 font-normal">{item.school}</span>
                      </p>

                      {/* Tags */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Statistics */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 text-[11px] text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        👁️ {item.views}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500 font-medium">
                        ❤️ {item.likes}
                      </span>
                    </div>
                    <button className="font-bold text-[#005a9c] hover:underline">
                      เปิดดูเล่ม ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>


          {/* ================= RIGHT SIDEBAR (Col 4) ================= */}
          <div className="space-y-6 lg:col-span-4">
            
            {/* 1. Leaderboard พอร์ตยอดนิยม */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#003b73] flex items-center gap-2">
                  🏆 พอร์ตติดท็อปสัปดาห์นี้
                </h3>
                <span className="text-[10px] font-bold text-gray-400">Weekly Top</span>
              </div>

              <div className="mt-3 space-y-3">
                {PORTFOLIOS.slice(0, 3).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black ${
                      index === 0 ? "bg-amber-100 text-amber-700" : index === 1 ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-gray-800 truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-400">{item.student}</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-500">❤️ {item.likes}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ฟอรัมพูดคุย & ถามตอบ */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-[#003b73]">💬 พูดคุยเรื่อง Portfolio</h3>
                <a href="#" className="text-[11px] text-blue-600 hover:underline">ตั้งกระทู้</a>
              </div>

              <div className="mt-3 space-y-3">
                {DISCUSSIONS.map((topic, index) => (
                  <div key={index} className="border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-gray-700 hover:text-blue-600 cursor-pointer line-clamp-1">
                      {topic.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400">
                      <span>โดย {topic.author}</span>
                      <span>💬 {topic.replies} ตอบ • {topic.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. คำแนะนำสำหรับการยื่นพอร์ต */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <h4 className="text-xs font-extrabold text-[#003b73]">💡 ข้อควรระวังในการยื่น Portfolio</h4>
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