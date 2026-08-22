import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getExamCategories, getExamSetsByCategory } from "@/lib/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faClock,
  faListCheck,
  faArrowRight,
  faArrowUpRightFromSquare,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

export const dynamic = "force-dynamic";

const OFFICIAL_RESOURCES = [
  {
    name: "mytcas.com — คู่มือและตัวอย่างข้อสอบ TGAT/TPAT/A-Level ฉบับทางการ",
    url: "https://www.mytcas.com",
  },
  {
    name: "สทศ. (NIETS) — ตัวอย่างข้อสอบและเกณฑ์การวัดผลระดับชาติ",
    url: "https://www.niets.or.th",
  },
  {
    name: "British Council — แบบทดสอบ IELTS ตัวอย่างฟรี",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests",
  },
  {
    name: "ETS — TOEFL iBT Free Practice Test",
    url: "https://www.ets.org/toefl/test-takers/ibt/prepare.html",
  },
  {
    name: "CU-TEP (จุฬาลงกรณ์มหาวิทยาลัย) — ตัวอย่างข้อสอบฉบับทางการ",
    url: "https://www.atc.chula.ac.th/th_ver/test_cutep_intro.php",
  },
];

export default async function ExamBankPage() {
  const categories = await getExamCategories();
  const categoriesWithSets = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      sets: await getExamSetsByCategory(cat.id),
    }))
  );

  const grouped = categoriesWithSets.reduce<Record<string, typeof categoriesWithSets>>((acc, cat) => {
    acc[cat.group_name] = acc[cat.group_name] ?? [];
    acc[cat.group_name].push(cat);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold text-[#003b73] sm:text-4xl">คลังข้อสอบฝึกทำ</h1>
          <p className="mt-1 text-sm text-gray-500">
            ฝึกทำข้อสอบจำลอง TGAT / TPAT / A-Level และภาษาอังกฤษ พร้อมเฉลยและคำอธิบายทันทีหลังส่งคำตอบ
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-800">
          <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 shrink-0" />
          <span>
            ข้อสอบในหน้านี้เป็น<strong>ข้อสอบจำลองที่ทีมงาน NextBeyond แต่งขึ้นเอง</strong> ในสไตล์เดียวกับข้อสอบจริง
            ไม่ใช่ข้อสอบเก่าจริงของ สทศ./ทปอ./British Council/ETS/จุฬาฯ เนื่องจากข้อสอบจริงมีลิขสิทธิ์
            หากต้องการข้อสอบตัวอย่างฉบับทางการ ดูลิงก์แหล่งข้อมูลจริงด้านล่าง
          </span>
        </div>

        {Object.entries(grouped).map(([groupName, cats]) => (
          <section key={groupName} className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-[#003b73]">{groupName}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((cat) => {
                const totalQuestions = cat.sets.reduce((sum, s) => sum + s.question_count, 0);
                return (
                  <div
                    key={cat.id}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${cat.color}`} />
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-500">
                          <FontAwesomeIcon icon={faBookOpen} />
                          {cat.group_name}
                        </span>
                        <h3 className="mt-2.5 text-base font-bold text-gray-800">{cat.name}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{cat.description}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faListCheck} /> {totalQuestions} ข้อ
                          </span>
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} /> {cat.sets[0]?.duration_minutes ?? 20} นาที
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/exam-bank/${cat.code}`}
                        className={`mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${cat.color} py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all hover:shadow-md`}
                      >
                        เริ่มฝึกทำ
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* แหล่งข้อสอบจริงฟรีจากเจ้าของข้อสอบโดยตรง */}
        <section className="mt-10 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#003b73]">แหล่งข้อสอบตัวอย่างฉบับทางการ (ฟรี)</h2>
          <p className="mt-1 text-xs text-gray-500">
            ลิงก์ตรงไปยังเจ้าของข้อสอบจริงแต่ละประเภท เผื่อต้องการฝึกกับข้อสอบตัวอย่างฉบับทางการ
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {OFFICIAL_RESOURCES.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#003b73]"
              >
                {r.name}
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="shrink-0 text-gray-400" />
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
