"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/lib/useSiteSettings";

// Font Awesome Integration
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCalendarDays,
  faClock,
  faUser,
  faBookmark,
  faMagnifyingGlass,
  faArrowRight,
  faPaperPlane,
  faUniversity,
  faFire,
  faBullhorn,
  faRotate,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

interface HotTopicItem {
  id: number;
  title: string;
  time_label: string;
  tag: string;
}

interface GoogleNewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  image: string;
}

interface NewsArticleItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  article_date: string;
  read_time: string;
  author: string;
  image_color: string;
  cover_image: string | null;
}

export default function NewsPage() {
  const [selectedCat, setSelectedCat] = useState("ทั้งหมด");
  const [activeTab, setActiveTab] = useState("ล่าสุด");
  const [HOT_TOPICS, setHotTopics] = useState<HotTopicItem[]>([]);
  const [MAIN_NEWS, setMainNews] = useState<NewsArticleItem[]>([]);
  const [googleNews, setGoogleNews] = useState<GoogleNewsItem[]>([]);
  const [loadingGoogleNews, setLoadingGoogleNews] = useState(true);
  const settings = useSiteSettings();

  const CATEGORIES = [
    "ทั้งหมด",
    "ประกาศรับสมัคร",
    "TCAS / ทปอ.",
    "เกณฑ์การสอบ",
    "ทุนการศึกษา",
    "เทคนิคเตรียมสอบ",
  ];

  useEffect(() => {
    const controller = new AbortController();

    async function loadNewsContent() {
      try {
        const response = await fetch("/api/content/news", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load news content");

        const data = await response.json();
        setHotTopics(data.hotTopics);
        setMainNews(data.mainNews);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setHotTopics([]);
          setMainNews([]);
        }
      }
    }

    loadNewsContent();
    return () => controller.abort();
  }, []);

  // ระบบอัตโนมัติดึงข่าวการศึกษา/TCAS ล่าสุดจาก Google News พร้อมรีเฟรชอัตโนมัติทุก 10 นาที
  useEffect(() => {
    const controller = new AbortController();

    async function loadGoogleNews() {
      try {
        const response = await fetch("/api/news/google", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load Google News");

        const data = await response.json();
        setGoogleNews(data.items ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setGoogleNews([]);
        }
      } finally {
        setLoadingGoogleNews(false);
      }
    }

    loadGoogleNews();
    const interval = setInterval(loadGoogleNews, 10 * 60 * 1000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <Navbar />

      {/* --- TOP NEWS TICKER / BANNER --- */}
      <div className="bg-[#0b1e3d] text-white text-xs border-b border-gray-800">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="shrink-0 rounded bg-red-600 px-2 py-0.5 font-black uppercase tracking-wider animate-pulse flex items-center gap-1.5">
              <FontAwesomeIcon icon={faBullhorn} /> LIVE NEWS
            </span>
            <p className="truncate text-gray-300">
              {settings?.live_news_ticker ||
                "[TCAS70 Update] ระบบ MyTCAS เตรียมเปิดลงทะเบียน 28 ต.ค. นี้ • เช็กเกณฑ์พอร์ตแพทย์ศิริราชฯ ล่าสุด • ม.เกษตรแจกทุนเรียนฟรี 100%"}
            </p>
          </div>
          <span className="hidden sm:inline-block shrink-0 text-gray-400 text-[11px]">
            อัปเดตล่าสุด: 28 ก.ค. 2026
          </span>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        
        {/* --- MAGAZINE HERO GRID --- */}
        <section className="mb-10 grid gap-6 lg:grid-cols-12">
          
          {/* ข่าวใหญ่หลัก (Col 8) */}
          <div
            className="relative overflow-hidden rounded-xl bg-[#002b55] bg-cover bg-center p-6 text-white shadow-md sm:p-8 lg:col-span-8 flex flex-col justify-between"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#002b55]/95 via-[#002b55]/85 to-[#0066c4]/55" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-xl bg-amber-400 px-3 py-1 text-[11px] font-extrabold text-[#002b55] flex items-center gap-1.5">
                <FontAwesomeIcon icon={faFire} /> ข่าวใหญ่ประจำวัน
              </span>
              <span className="text-xs text-blue-200">28 กรกฎาคม 2026</span>
            </div>

            <div className="relative z-10 my-8">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                TCAS70 / OFFICIAL ANNOUNCEMENT
              </span>
              <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl text-white">
                ทปอ. ประกาศปฏิทินสอบ TCAS70 ยืนยันสอบ TGAT/TPAT ธันวาคมนี้!
              </h1>
              <p className="mt-3 text-xs text-blue-100 sm:text-sm line-clamp-2 leading-relaxed opacity-90">
                สรุปกำหนดการสำคัญสำหรับนักเรียน ม.6 ทั้งวันเปิดลงทะเบียน MyTCAS, วันยื่นพอร์ตโฟลิโอรอบ 1, วันสอบ TGAT/TPAT และวันสอบ A-Level ครบถ้วนในที่เดียว
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 text-xs text-blue-200">
                <span><FontAwesomeIcon icon={faUser} className="mr-1.5" /> ทีมงาน NextBeyond</span>
                <span>•</span>
                <span><FontAwesomeIcon icon={faClock} className="mr-1.5" /> อ่าน 5 นาที</span>
              </div>
              <button className="rounded-xl bg-white px-5 py-2.5 text-xs font-extrabold text-[#002b55] transition-all hover:bg-amber-300 hover:scale-105 shadow flex items-center gap-2">
                อ่านแถลงการณ์ฉบับเต็ม <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>

          {/* แถบข่าวด่วนย่อย (Col 4) */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-black text-[#002b55] flex items-center gap-2">
                  <FontAwesomeIcon icon={faBolt} className="text-amber-500" /> เกาะติดข่าวด่วน
                </h3>
                <span className="text-[10px] font-bold text-red-500">REALTIME</span>
              </div>

              <div className="mt-4 space-y-4">
                {HOT_TOPICS.map((item) => (
                  <div key={item.id} className="group cursor-pointer border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                        item.tag === "HOT" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {item.tag}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.time_label}</span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-gray-800 group-hover:text-[#004b8d] transition-colors leading-snug">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100 text-center">
              <p className="text-xs font-bold text-[#002b55]">อยากรู้เกณฑ์คณะไหนเป็นพิเศษ?</p>
              <button className="mt-2 w-full rounded-xl bg-[#004b8d] py-2 text-xs font-bold text-white hover:bg-[#002b55] flex items-center justify-center gap-2 transition-colors">
                <FontAwesomeIcon icon={faMagnifyingGlass} /> ค้นหาเกณฑ์การรับสมัคร
              </button>
            </div>
          </div>

        </section>

        {/* --- ข่าวการศึกษาเพิ่มเติมจากแหล่งข่าวทั่วประเทศ --- */}
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-black text-[#002b55]">
              <FontAwesomeIcon icon={faRotate} className={`text-emerald-500 ${loadingGoogleNews ? "animate-spin" : ""}`} />
              ข่าวการศึกษาเพิ่มเติม
            </h3>
          </div>

          {loadingGoogleNews ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
              กำลังดึงข่าวล่าสุดจาก Google News...
            </div>
          ) : googleNews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
              ยังไม่สามารถเชื่อมต่อ Google News ได้ในขณะนี้ ลองรีเฟรชหน้าใหม่อีกครั้ง
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {googleNews.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img src={item.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                      Google News
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <h4 className="text-xs font-bold leading-snug text-gray-800 line-clamp-3 group-hover:text-[#004b8d]">
                      {item.title}
                    </h4>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                      <span className="truncate">{item.source} · {item.pubDate}</span>
                      <FontAwesomeIcon icon={faUpRightFromSquare} className="shrink-0 text-gray-300 group-hover:text-blue-500" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedCat === cat
                    ? "bg-[#002b55] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 shrink-0">
            <span>เรียงตาม:</span>
            <button
              onClick={() => setActiveTab("ล่าสุด")}
              className={`px-2 py-1 rounded ${activeTab === "ล่าสุด" ? "text-[#002b55] font-bold underline" : ""}`}
            >
              ล่าสุด
            </button>
            <span>|</span>
            <button
              onClick={() => setActiveTab("ยอดนิยม")}
              className={`px-2 py-1 rounded ${activeTab === "ยอดนิยม" ? "text-[#002b55] font-bold underline" : ""}`}
            >
              ยอดนิยม
            </button>
          </div>
        </div>

        {/* --- MAIN FEED & SIDEBAR --- */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* LEFT: HORIZONTAL NEWS FEED (Col 8) */}
          <div className="space-y-4 lg:col-span-8">
            {MAIN_NEWS.map((news) => (
              <article
                key={news.id}
                className="group flex flex-col sm:flex-row gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                {/* Thumb Image */}
                <div
                  className={`relative h-44 sm:h-auto sm:w-52 shrink-0 overflow-hidden rounded-xl p-4 text-white flex flex-col justify-between shadow-inner ${
                    news.cover_image ? "" : `bg-gradient-to-br ${news.image_color}`
                  }`}
                >
                  {news.cover_image && (
                    <img src={news.cover_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <span className="relative z-10 self-start rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                    {news.category}
                  </span>
                  <span className="relative z-10 text-[10px] text-white/80 font-semibold">NextBeyond News</span>
                </div>

                {/* Content Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span><FontAwesomeIcon icon={faCalendarDays} className="mr-1" /> {news.article_date}</span>
                      <span>•</span>
                      <span><FontAwesomeIcon icon={faClock} className="mr-1" /> {news.read_time}</span>
                      <span>•</span>
                      <span><FontAwesomeIcon icon={faUser} className="mr-1" /> {news.author}</span>
                    </div>

                    <h3 className="mt-2 text-base font-extrabold text-gray-900 group-hover:text-[#004b8d] transition-colors leading-snug">
                      {news.title}
                    </h3>

                    <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {news.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <Link href={`/news/${news.id}`} className="text-xs font-bold text-[#004b8d] group-hover:underline flex items-center gap-1.5">
                      อ่านต่อรายละเอียด <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                    <button className="text-gray-400 hover:text-blue-600 text-xs flex items-center gap-1">
                      <FontAwesomeIcon icon={faBookmark} /> บันทึกข่าว
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
                หน้าก่อนหน้า
              </button>
              <button className="rounded-xl bg-[#002b55] px-4 py-2 text-xs font-bold text-white">
                1
              </button>
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
                2
              </button>
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">
                หน้าถัดไป
              </button>
            </div>
          </div>

          {/* RIGHT: SIDEBAR WIDGETS (Col 4) */}
          <div className="space-y-6 lg:col-span-4">
            
            {/* Widget 1: ปฏิทินวันสำคัญนับถอยหลัง */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#002b55] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600" /> นับถอยหลังวันสอบ TCAS70
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-blue-50 p-3.5">
                  <div>
                    <h4 className="text-xs font-bold text-[#002b55]">สอบ TGAT / TPAT</h4>
                    <span className="text-[10px] text-gray-500">7 - 9 ธันวาคม 2026</span>
                  </div>
                  <span className="rounded-xl bg-[#002b55] px-3 py-1.5 text-xs font-black text-amber-300">
                    อีก 132 วัน
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-orange-50 p-3.5">
                  <div>
                    <h4 className="text-xs font-bold text-orange-900">สอบ A-Level</h4>
                    <span className="text-[10px] text-gray-500">16 - 18 มีนาคม 2027</span>
                  </div>
                  <span className="rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-black text-white">
                    อีก 231 วัน
                  </span>
                </div>
              </div>
            </div>

            {/* Widget 2: ติดตามข่าวแยกตามมหาวิทยาลัย */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#002b55] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faUniversity} className="text-[#002b55]" /> ประกาศตามมหาวิทยาลัย
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <a href="#" className="rounded-xl bg-pink-50 p-3 text-pink-700 hover:bg-pink-100 text-center">
                  จุฬาลงกรณ์ฯ
                </a>
                <a href="#" className="rounded-xl bg-blue-50 p-3 text-blue-700 hover:bg-blue-100 text-center">
                  มหิดล
                </a>
                <a href="#" className="rounded-xl bg-emerald-50 p-3 text-emerald-700 hover:bg-emerald-100 text-center">
                  เกษตรศาสตร์
                </a>
                <a href="#" className="rounded-xl bg-amber-50 p-3 text-amber-800 hover:bg-amber-100 text-center">
                  ธรรมศาสตร์
                </a>
                <a href="#" className="rounded-xl bg-orange-50 p-3 text-orange-700 hover:bg-orange-100 text-center">
                  สจล. ลาดกระบัง
                </a>
                <a href="#" className="rounded-xl bg-purple-50 p-3 text-purple-700 hover:bg-purple-100 text-center">
                  เชียงใหม่
                </a>
              </div>
            </div>

            {/* Widget 3: Newsletter Box */}
            <div className="rounded-xl bg-gradient-to-br from-[#002b55] to-[#004b8d] p-6 text-white shadow-md">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <FontAwesomeIcon icon={faPaperPlane} /> FREE NEWSLETTER
              </span>
              <h3 className="mt-1 text-base font-extrabold">ไม่พลาดทุกสรุปข่าวด่วน</h3>
              <p className="mt-1 text-xs text-blue-100 leading-relaxed">
                ส่งตรงสรุปเกณฑ์รับสมัครและแจ้งเตือนวันสอบเข้าอีเมลของคุณทุกสัปดาห์
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-2">
                <input
                  type="email"
                  placeholder="กรอกอีเมลของคุณ..."
                  className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder-blue-200 outline-none border border-white/20 focus:border-amber-300"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-extrabold text-[#002b55] transition-all hover:bg-amber-300 flex items-center justify-center gap-2"
                >
                  สมัครรับข่าวสารฟรี <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </form>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}