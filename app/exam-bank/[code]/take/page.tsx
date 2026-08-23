"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faClock,
  faCircleCheck,
  faCircleXmark,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

interface ExamSetInfo {
  id: number;
  title: string;
  description: string | null;
  duration_minutes: number;
}

interface QuestionSafe {
  id: number;
  question_type: "mc" | "error_id" | "listening";
  audio_path: string | null;
  question_text: string;
  choices: string[] | { segments: string[]; underlineIndexes: number[] };
}

interface ReviewItem {
  id: number;
  question_type: "mc" | "error_id" | "listening";
  question_text: string;
  choices: string[] | { segments: string[]; underlineIndexes: number[] };
  chosen: number | null;
  correct_index: number;
  explanation: string | null;
  isCorrect: boolean;
}

export default function TakeExamPage() {
  return (
    <Suspense fallback={null}>
      <TakeExamContent />
    </Suspense>
  );
}

function TakeExamContent() {
  const params = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const setId = searchParams.get("set");
  const isPrintMode = searchParams.get("print") === "1";

  const [examSet, setExamSet] = useState<ExamSetInfo | null>(null);
  const [questions, setQuestions] = useState<QuestionSafe[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ score: number; total: number; review: ReviewItem[] } | null>(null);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!setId) return;
    fetch(`/api/exam/sets/${setId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setExamSet(data.examSet);
          setQuestions(data.questions);
        }
      })
      .catch(() => setError("โหลดข้อสอบไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [setId]);

  useEffect(() => {
    if (isPrintMode && !loading && questions.length > 0) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [isPrintMode, loading, questions.length]);

  const answeredCount = Object.keys(answers).length;

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);

    const res = await fetch("/api/exam/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examSetId: Number(setId), answers, durationSeconds }),
    });
    const data = await res.json();

    if (res.status === 401) {
      router.push("/login");
      return;
    }
    if (!res.ok) {
      setError(data.error || "ส่งคำตอบไม่สำเร็จ");
    } else {
      setResult(data);
    }
    setSubmitting(false);
  }

  if (!setId) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8fbff]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-sm text-gray-400">ไม่พบชุดข้อสอบที่ระบุ</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 lg:px-8">
        <Link
          href={`/exam-bank/${params.code}`}
          className="nb-no-print inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeftLong} />
          กลับ
        </Link>

        {loading ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-xs text-gray-400">
            กำลังโหลดข้อสอบ...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-dashed border-red-200 bg-red-50 p-10 text-center text-xs text-red-500">
            {error}
          </div>
        ) : (
          <div id="exam-pdf-content" className="mt-4">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-lg font-extrabold text-[#003b73]">{examSet?.title}</h1>
                {!isPrintMode && (
                  <button
                    onClick={() => window.print()}
                    className="nb-no-print flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    <FontAwesomeIcon icon={faPrint} /> พิมพ์ / บันทึก PDF
                  </button>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                <FontAwesomeIcon icon={faClock} /> ประมาณ {examSet?.duration_minutes} นาที · {questions.length} ข้อ
              </p>
            </div>

            {result && (
              <div className="nb-no-print mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">ผลคะแนนของคุณ</p>
                <p className="mt-1 text-3xl font-extrabold text-emerald-700">
                  {result.score} / {result.total}
                </p>
              </div>
            )}

            <div className="mt-5 space-y-5">
              {questions.map((q, index) => {
                const reviewItem = result?.review.find((r) => r.id === q.id);
                return (
                  <div key={q.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-bold text-gray-800">
                      ข้อ {index + 1}. {q.question_text}
                    </p>

                    {q.question_type === "listening" && q.audio_path && (
                      <audio controls src={q.audio_path} className="nb-no-print mt-3 w-full">
                        เบราว์เซอร์ของคุณไม่รองรับการเล่นเสียง
                      </audio>
                    )}

                    {q.question_type === "error_id" ? (
                      <ErrorIdQuestion
                        choices={q.choices as { segments: string[]; underlineIndexes: number[] }}
                        selected={answers[q.id]}
                        disabled={!!result || isPrintMode}
                        reviewItem={reviewItem}
                        onSelect={(idx) => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                      />
                    ) : (
                      <div className="mt-3 space-y-2">
                        {(q.choices as string[]).map((choice, choiceIdx) => {
                          const isSelected = answers[q.id] === choiceIdx;
                          const isCorrectChoice = reviewItem && choiceIdx === reviewItem.correct_index;
                          const isWrongSelected = reviewItem && isSelected && !reviewItem.isCorrect;
                          return (
                            <button
                              key={choiceIdx}
                              disabled={!!result || isPrintMode}
                              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: choiceIdx }))}
                              className={`flex w-full items-center gap-2 rounded-lg border px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                                isCorrectChoice
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                  : isWrongSelected
                                    ? "border-red-300 bg-red-50 text-red-700"
                                    : isSelected
                                      ? "border-blue-400 bg-blue-50 text-[#003b73]"
                                      : "border-gray-200 bg-gray-50/50 text-gray-700 hover:border-blue-200"
                              }`}
                            >
                              {isCorrectChoice && <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />}
                              {isWrongSelected && <FontAwesomeIcon icon={faCircleXmark} className="text-red-500" />}
                              {choice}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {reviewItem?.explanation && (
                      <p className="nb-no-print mt-3 rounded-lg bg-blue-50/70 p-3 text-[11px] leading-relaxed text-blue-900">
                        <strong>เฉลย:</strong> {reviewItem.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!result && !isPrintMode && (
              <div className="nb-no-print mt-6 flex flex-col items-center gap-2">
                <p className="text-xs text-gray-400">
                  ตอบแล้ว {answeredCount} / {questions.length} ข้อ
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answeredCount === 0}
                  className="w-full rounded-xl bg-[#005a9c] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#003b73] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "กำลังส่งคำตอบ..." : "ส่งคำตอบและดูผลคะแนน"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ErrorIdQuestion({
  choices,
  selected,
  disabled,
  reviewItem,
  onSelect,
}: {
  choices: { segments: string[]; underlineIndexes: number[] };
  selected: number | undefined;
  disabled: boolean;
  reviewItem: ReviewItem | undefined;
  onSelect: (underlineChoiceIndex: number) => void;
}) {
  const underlinePositions = useMemo(() => choices.underlineIndexes, [choices]);

  return (
    <p className="mt-3 text-sm leading-loose text-gray-700">
      {choices.segments.map((segment, segIdx) => {
        const underlineChoiceIdx = underlinePositions.indexOf(segIdx);
        if (underlineChoiceIdx === -1) {
          return <span key={segIdx}>{segment}</span>;
        }

        const isSelected = selected === underlineChoiceIdx;
        const isCorrectChoice = reviewItem && underlineChoiceIdx === reviewItem.correct_index;
        const isWrongSelected = reviewItem && isSelected && !reviewItem.isCorrect;

        return (
          <button
            key={segIdx}
            disabled={disabled}
            onClick={() => onSelect(underlineChoiceIdx)}
            className={`mx-0.5 rounded px-1 underline decoration-2 underline-offset-4 transition-colors ${
              isCorrectChoice
                ? "bg-emerald-100 text-emerald-800 decoration-emerald-500"
                : isWrongSelected
                  ? "bg-red-100 text-red-700 decoration-red-500"
                  : isSelected
                    ? "bg-blue-100 text-[#003b73] decoration-blue-500"
                    : "decoration-gray-400 hover:bg-blue-50"
            }`}
          >
            {segment}
          </button>
        );
      })}
    </p>
  );
}
