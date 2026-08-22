import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getExamQuestions, getExamAttemptsForUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }
  const attempts = await getExamAttemptsForUser(user.id);
  return NextResponse.json({ attempts });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนส่งคำตอบ" }, { status: 401 });
  }

  const body = await request.json();
  const examSetId = Number(body.examSetId);
  const answers: Record<string, number> = body.answers ?? {};
  const durationSeconds = Number(body.durationSeconds) || 0;

  if (!Number.isInteger(examSetId)) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const questions = await getExamQuestions(examSetId);
  if (questions.length === 0) {
    return NextResponse.json({ error: "ไม่พบชุดข้อสอบนี้" }, { status: 404 });
  }

  let score = 0;
  const review = questions.map((q) => {
    const chosen = answers[String(q.id)];
    const isCorrect = chosen === q.correct_index;
    if (isCorrect) score += 1;
    return {
      id: q.id,
      question_type: q.question_type,
      question_text: q.question_text,
      choices: q.choices,
      chosen: chosen ?? null,
      correct_index: q.correct_index,
      explanation: q.explanation,
      isCorrect,
    };
  });

  await pool.query(
    `INSERT INTO exam_attempts (user_id, exam_set_id, answers, score, total, duration_seconds)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user.id, examSetId, JSON.stringify(answers), score, questions.length, durationSeconds]
  );

  return NextResponse.json({ score, total: questions.length, review });
}
