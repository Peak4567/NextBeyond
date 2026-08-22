import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getExamCategoryByCode, getExamSetsByCategory } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faClock,
  faListCheck,
  faPlay,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

export const dynamic = "force-dynamic";

export default async function ExamCategoryPage({ params }: { params: { code: string } }) {
  const category = await getExamCategoryByCode(params.code);
  if (!category) notFound();

  const sets = await getExamSetsByCategory(category.id);
  const user = await getSessionUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 lg:px-8">
        <Link href="/exam-bank" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
          <FontAwesomeIcon icon={faArrowLeftLong} />
          กลับไปคลังข้อสอบ
        </Link>

        <div className={`mt-3 overflow-hidden rounded-xl bg-gradient-to-br ${category.color} p-6 text-white shadow-md sm:p-8`}>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
            {category.group_name}
          </span>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/90">{category.description}</p>
        </div>

        <div className="mt-6 space-y-4">
          {sets.map((set) => (
            <div key={set.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-800">{set.title}</h3>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faListCheck} /> {set.question_count} ข้อ
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faClock} /> ประมาณ {set.duration_minutes} นาที
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/exam-bank/${category.code}/take?set=${set.id}`}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${category.color} py-3 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md`}
                >
                  <FontAwesomeIcon icon={faPlay} />
                  ทำในเว็บเลย
                </Link>
                <Link
                  href={`/exam-bank/${category.code}/take?set=${set.id}&print=1`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/60 py-3 text-sm font-bold text-[#003b73] transition-colors hover:bg-blue-100"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
                  ดาวน์โหลด PDF
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!user && (
          <p className="mt-4 text-center text-xs text-gray-400">
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              เข้าสู่ระบบ
            </Link>{" "}
            เพื่อบันทึกประวัติคะแนนการทำข้อสอบของคุณ
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
