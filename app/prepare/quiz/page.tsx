"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faArrowRight, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { getCourseIcon } from "@/lib/courseIcon";

type Category = "eng" | "med" | "biz" | "art" | "sci";

interface Question {
  question: string;
  options: { label: string; value: Category }[];
}

const QUESTIONS: Question[] = [
  {
    question: "เวลาว่างชอบทำอะไรมากที่สุด?",
    options: [
      { label: "ประกอบ/ซ่อมของ หรือเล่นกับคอมพิวเตอร์", value: "eng" },
      { label: "ดูสารคดีสุขภาพ หรือดูแลช่วยเหลือคนอื่น", value: "med" },
      { label: "วางแผนทำธุรกิจเล็กๆ หรือขายของออนไลน์", value: "biz" },
      { label: "ถ่ายรูป ทำคอนเทนต์ หรือวาดรูป", value: "art" },
      { label: "ทดลองวิทยาศาสตร์ หรือวิเคราะห์ข้อมูล", value: "sci" },
    ],
  },
  {
    question: "วิชาที่เรียนแล้วสนุกที่สุด?",
    options: [
      { label: "คณิตศาสตร์ / ฟิสิกส์", value: "eng" },
      { label: "ชีววิทยา / สุขศึกษา", value: "med" },
      { label: "สังคมศึกษา / เศรษฐศาสตร์", value: "biz" },
      { label: "ภาษา / ศิลปะ", value: "art" },
      { label: "เคมี / สถิติ", value: "sci" },
    ],
  },
  {
    question: "ถ้าต้องทำโปรเจกต์กลุ่ม อยากรับหน้าที่ไหน?",
    options: [
      { label: "ออกแบบระบบ หรือเขียนโปรแกรม", value: "eng" },
      { label: "ดูแลความปลอดภัยและสุขภาพของทีม", value: "med" },
      { label: "บริหารจัดการงบประมาณและแผนงาน", value: "biz" },
      { label: "นำเสนอผลงาน หรือออกแบบสื่อ", value: "art" },
      { label: "เก็บและวิเคราะห์ข้อมูล", value: "sci" },
    ],
  },
  {
    question: "อยากทำงานแบบไหนในอนาคต?",
    options: [
      { label: "สร้างสิ่งประดิษฐ์หรือนวัตกรรมใหม่ๆ", value: "eng" },
      { label: "ดูแลรักษาผู้ป่วยหรือช่วยเหลือผู้อื่น", value: "med" },
      { label: "เป็นเจ้าของธุรกิจหรือนักบริหาร", value: "biz" },
      { label: "สร้างสรรค์คอนเทนต์หรือสื่อสารมวลชน", value: "art" },
      { label: "เป็นนักวิจัยหรือนักวิเคราะห์ข้อมูล", value: "sci" },
    ],
  },
  {
    question: "คำไหนตรงกับตัวคุณที่สุด?",
    options: [
      { label: "มีเหตุผล ชอบเทคโนโลยี", value: "eng" },
      { label: "เห็นอกเห็นใจ ใส่ใจผู้อื่น", value: "med" },
      { label: "มั่นใจ กล้าตัดสินใจ", value: "biz" },
      { label: "สร้างสรรค์ มีจินตนาการ", value: "art" },
      { label: "ช่างสงสัย ละเอียดรอบคอบ", value: "sci" },
    ],
  },
];

const RESULTS: Record<Category, { label: string; searchTerm: string; description: string }> = {
  eng: {
    label: "สายวิศวกรรม / เทคโนโลยี",
    searchTerm: "วิศวกรรมคอมพิวเตอร์",
    description: "คุณมีแนวคิดเชิงระบบและชอบแก้ปัญหาด้วยเหตุผล เหมาะกับสายวิศวกรรมคอมพิวเตอร์ ซอฟต์แวร์ หรือปัญญาประดิษฐ์",
  },
  med: {
    label: "สายแพทย์ / สาธารณสุข",
    searchTerm: "แพทยศาสตร์",
    description: "คุณใส่ใจดูแลผู้อื่นและมีความละเอียดรอบคอบ เหมาะกับสายแพทยศาสตร์ พยาบาล หรือสาธารณสุข",
  },
  biz: {
    label: "สายบริหารธุรกิจ",
    searchTerm: "บริหารธุรกิจ",
    description: "คุณมีภาวะผู้นำและกล้าตัดสินใจ เหมาะกับสายบริหารธุรกิจ การเงิน หรือการตลาด",
  },
  art: {
    label: "สายนิเทศศาสตร์ / ศิลปะ",
    searchTerm: "นิเทศศาสตร์",
    description: "คุณมีความคิดสร้างสรรค์และชอบสื่อสาร เหมาะกับสายนิเทศศาสตร์ สื่อสารมวลชน หรือศิลปกรรม",
  },
  sci: {
    label: "สายวิทยาศาสตร์ / ข้อมูล",
    searchTerm: "วิทยาการข้อมูล",
    description: "คุณช่างสงสัยและชอบวิเคราะห์อย่างเป็นระบบ เหมาะกับสายวิทยาศาสตร์ วิทยาการข้อมูล หรือสถิติ",
  },
};

export default function SelfDiscoveryQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Category[]>([]);

  const isDone = step >= QUESTIONS.length;

  function handleAnswer(value: Category) {
    setAnswers((prev) => [...prev, value]);
    setStep((prev) => prev + 1);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  const resultCategory = isDone
    ? (Object.entries(
        answers.reduce<Record<string, number>>((acc, val) => {
          acc[val] = (acc[val] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0] as Category)
    : null;

  const result = resultCategory ? RESULTS[resultCategory] : null;
  const resultIcon = result ? getCourseIcon(result.searchTerm) : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-10 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
          <FontAwesomeIcon icon={faArrowLeftLong} />
          กลับหน้าแรก
        </Link>

        <div className="mt-3 mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-[#003b73] sm:text-3xl">แบบทดสอบค้นหาตนเอง</h1>
          <p className="mt-1 text-sm text-gray-500">ตอบ 5 คำถามสั้นๆ เพื่อค้นหาสายที่เหมาะกับคุณ</p>
        </div>

        {!isDone ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">
                คำถามที่ {step + 1} / {QUESTIONS.length}
              </span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#005a9c] transition-all duration-300"
                  style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="mb-5 text-lg font-bold text-gray-800">{QUESTIONS[step].question}</h2>

            <div className="space-y-2.5">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-all hover:border-[#005a9c] hover:bg-blue-50 hover:text-[#003b73]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          result &&
          resultIcon && (
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${resultIcon.colorClass} text-2xl text-white shadow-md`}
              >
                <FontAwesomeIcon icon={resultIcon.icon} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-500">ผลลัพธ์ของคุณ</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#003b73]">{result.label}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">{result.description}</p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={`/prepare?q=${encodeURIComponent(result.searchTerm)}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#005a9c] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#003b73]"
                >
                  ดูเกณฑ์รับสมัครสายนี้ <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </Link>
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50"
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                  ทำแบบทดสอบอีกครั้ง
                </button>
              </div>
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
