import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getCourses,
  getTeamMembers,
  getNewsArticles,
  getNewsHotTopics,
  getAdmissionCriteria,
} from "@/lib/data";
import { getAutoUpdatedNews } from "@/lib/googleNews";
import { getCourseVisualsForList } from "@/lib/courseIcon";
import { getSettings } from "@/lib/settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBullhorn,
  faCalendarDays,
  faClock,
  faArrowRight,
  faRotate,
  faListCheck,
  faUsers,
  faFire,
  faBrain,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [COURSES, TEAM, NEWS, HOT_TOPICS, googleNews, criteriaResult, settings] = await Promise.all([
    getCourses(),
    getTeamMembers(),
    getNewsArticles(),
    getNewsHotTopics(),
    getAutoUpdatedNews(3),
    getAdmissionCriteria({ limit: 1 }),
    getSettings(),
  ]);
  const LATEST_NEWS = NEWS.slice(0, 3);
  const TOP_HOT_TOPICS = HOT_TOPICS.slice(0, 4);
  const courseVisuals = getCourseVisualsForList(COURSES);
  const criteriaTotal = criteriaResult.total;
  const consultLink =
    settings.social_line && settings.social_line !== "#"
      ? settings.social_line
      : `mailto:${settings.contact_email}?subject=${encodeURIComponent("ขอปรึกษาการเข้ามหาวิทยาลัย")}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        <section className="relative overflow-hidden">
          {/* พื้นหลังตกแต่ง — ไล่สี + จุดลวดลาย ให้ดูมีมิติ ไม่โล่งเกินไป */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(#003b73 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#005a9c]">
                  <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                  แพลตฟอร์มแนะแนวเข้ามหาวิทยาลัยครบวงจร
                </span>

                <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#003b73] sm:text-3xl lg:text-5xl">
                  ก้าวเข้าสู่รั้วมหาวิทยาลัย
                  <br />
                  ด้วยระบบ <span className="text-[#e25a3a]">Next Beyond</span>
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
                  ศูนย์รวมคลังข้อสอบและสรุปเนื้อหา พร้อมระบบจำลองสอบ อัปเดตข่าวสาร
                  24 ชั่วโมง
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/community-students"
                    className="flex items-center gap-2 rounded-md bg-[#005a9c] px-8 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#004880] shadow-md"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    ค้นหา Portfolio
                  </Link>
                  <Link
                    href="/prepare/quiz"
                    className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:bg-gray-50 shadow-sm"
                  >
                    <FontAwesomeIcon icon={faBrain} />
                    ทำแบบทดสอบค้นหาตนเอง
                  </Link>
                </div>

                {/* แถบสถิติ — ให้หน้าแรกดูมีเนื้อหาแน่นขึ้น ไม่โล่งเกินไป */}
                <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                  <div>
                    <p className="text-xl font-extrabold text-[#003b73] sm:text-2xl">
                      {criteriaTotal.toLocaleString("th-TH")}+
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">เกณฑ์รับสมัคร TCAS</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-[#003b73] sm:text-2xl">24 ชม.</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">อัปเดตข่าวสารทุกวัน</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-[#003b73] sm:text-2xl">ทุกคณะ</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">ทุกมหาวิทยาลัยทั่วประเทศ</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto flex items-center justify-center lg:justify-end w-full">
                <img
                  src="/img/next-person.png"
                  alt="Student studying illustration"
                  className="w-full max-w-md object-contain"
                />
                {/* การ์ดลอยตกแต่ง ให้ภาพประกอบดูมีมิติมากขึ้น */}
                <div className="absolute left-0 top-6 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 shadow-lg sm:left-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <FontAwesomeIcon icon={faClipboardCheck} className="text-sm" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-gray-800">ข้อมูลจริงจาก TCAS</p>
                    <p className="text-[10px] text-gray-400">ซิงก์ตรงจาก mytcas.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                <FontAwesomeIcon icon={faFire} />
                มาแรงที่สุดตอนนี้
              </span>
              <h2 className="mt-3 text-2xl font-bold text-[#003b73] sm:text-3xl">
                กลุ่มสาขายอดนิยม
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                รวบรวมหลักสูตรและคณะยอดนิยมที่น้องๆ
                เลือกเรียนเพื่อเตรียมสอบเข้ามหาวิทยาลัย
              </p>
            </div>
            <Link
              href="/prepare"
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-[#005a9c] transition-colors hover:bg-blue-100"
            >
              ดูเพิ่มเติม <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((course, index) => {
              const { icon, colorClass, image } = courseVisuals[index];
              return (
                <div
                  key={course.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* ภาพหัวการ์ดพร้อม overlay ไล่สีเข้ม */}
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-30 mix-blend-multiply`} />

                    {/* อันดับความนิยม */}
                    <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-[11px] font-black text-[#003b73] shadow-sm backdrop-blur-sm">
                      #{index + 1}
                    </span>

                    {/* ไอคอนกระจกฝ้า */}
                    <span
                      className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-lg text-white shadow-sm ring-1 ring-white/30 backdrop-blur-md transition-transform group-hover:scale-110`}
                    >
                      <FontAwesomeIcon icon={icon} />
                    </span>

                    {/* ชื่อสาขาซ้อนบนภาพ */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-lg font-extrabold leading-snug text-white drop-shadow-sm">
                        {course.title}
                      </h3>
                      <p className="text-xs font-semibold text-white/85">{course.university}</p>
                    </div>
                  </div>

                  {/* เนื้อหาสถิติ */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 font-bold text-gray-600">
                          <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                          รับ {course.quota}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 font-bold text-gray-600">
                          <FontAwesomeIcon icon={faListCheck} className="text-gray-400" />
                          {course.criteria}
                        </span>
                      </div>
                      <p className="pt-1 leading-relaxed text-gray-500">
                        <span className="font-bold text-gray-600">คุณสมบัติผู้สมัคร: </span>
                        {course.qualification}
                      </p>
                    </div>

                    <Link
                      href={`/prepare?q=${encodeURIComponent(course.title)}`}
                      className={`mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${colorClass} py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all hover:shadow-lg`}
                    >
                      ดูรายละเอียดเพิ่มเติม
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- ข่าวสารและประกาศล่าสุดเกี่ยวกับการเข้ามหาวิทยาลัย --- */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#003b73] sm:text-3xl">
                ข่าวสารและประกาศล่าสุด
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                อัปเดตข่าวรับสมัคร TCAS ทุนการศึกษา และประกาศจากมหาวิทยาลัยทั่วประเทศ
              </p>
            </div>
            <Link
              href="/news"
              className="flex items-center gap-1.5 text-sm font-bold text-[#005a9c] hover:underline"
            >
              ดูข่าวทั้งหมด <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>

          {/* ประกาศด่วน */}
          {TOP_HOT_TOPICS.length > 0 && (
            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-black text-[#002b55]">
                <FontAwesomeIcon icon={faBullhorn} className="text-red-500" /> ประกาศด่วน
              </div>
              <div className="flex flex-col divide-y divide-gray-50">
                {TOP_HOT_TOPICS.map((topic) => (
                  <div key={topic.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black ${
                        topic.tag === "HOT" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {topic.tag}
                    </span>
                    <span className="flex-1 truncate text-xs font-semibold text-gray-700">{topic.title}</span>
                    <span className="shrink-0 text-[10px] text-gray-400">{topic.time_label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ข่าวหลักจากทีมงาน NextBeyond */}
          {LATEST_NEWS.length > 0 && (
            <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {LATEST_NEWS.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className={`relative h-36 w-full overflow-hidden ${
                      news.cover_image ? "" : `bg-gradient-to-br ${news.image_color}`
                    }`}
                  >
                    {news.cover_image && (
                      <img src={news.cover_image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    )}
                    <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                      {news.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <h3 className="text-sm font-bold leading-snug text-gray-800 line-clamp-2 group-hover:text-[#005a9c]">
                      {news.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400">
                      <span><FontAwesomeIcon icon={faCalendarDays} className="mr-1" />{news.article_date}</span>
                      <span><FontAwesomeIcon icon={faClock} className="mr-1" />{news.read_time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ข่าวการศึกษาเพิ่มเติมจากแหล่งข่าวทั่วประเทศ */}
          {googleNews.items.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-black text-[#002b55]">
                <FontAwesomeIcon icon={faRotate} className="text-emerald-500" />
                ข่าวการศึกษาเพิ่มเติม
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {googleNews.items.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex gap-3 rounded-lg p-2 hover:bg-gray-50"
                  >
                    <img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-snug text-gray-700 line-clamp-2 group-hover:text-[#005a9c]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400">{item.source} · {item.pubDate}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <div
            className="relative overflow-hidden rounded-xl bg-[#0b2547] bg-cover bg-center px-8 py-10 shadow-md sm:px-14 lg:py-16"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#002347]/95 via-[#003b73]/85 to-[#003b73]/50" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  เริ่มวางแผนเข้ามหาวิทยาลัยแล้ววันนี้
                </h3>
                <p className="mt-2 text-sm text-white/90">
                  ปรึกษาฟรี ไม่มีค่าใช้จ่าย พร้อมทีมแนะแนวมืออาชีพดูแลทุกขั้นตอน
                </p>
              </div>
              <a
                href={consultLink}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap rounded-xl bg-[#fcd116] px-8 py-3 text-sm font-bold text-[#003b73] shadow-md transition-all hover:-translate-y-0.5 hover:bg-yellow-400"
              >
                ปรึกษาส่วนตัว
              </a>
            </div>
          </div>
        </section>

        {TEAM.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-[#003b73] sm:text-3xl">
                ผู้พัฒนา NextBeyond
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                ทีมงานผู้เชี่ยวชาญที่มุ่งมั่นพัฒนาระบบแนะแนวการศึกษาที่มีประสิทธิภาพสูงสุดสำหรับคุณ
              </p>
            </div>

            <div className="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((member) => (
                <div
                  key={member.id}
                  className="relative flex items-center rounded-xl bg-white px-6 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-h-[110px]"
                >
                  <div className="z-10 w-3/5">
                    <h4 className="text-[17px] font-bold text-[#1e3a8a]">
                      {member.name}
                    </h4>
                    <p className="text-[11px] font-bold text-gray-900 mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  <div className="absolute bottom-0 right-4 h-[160px] w-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-contain object-bottom drop-shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
