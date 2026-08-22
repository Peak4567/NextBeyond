import { NextResponse } from "next/server";
import { getExamSetById, getExamQuestions } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  const examSet = await getExamSetById(id);
  if (!examSet) {
    return NextResponse.json({ error: "ไม่พบชุดข้อสอบนี้" }, { status: 404 });
  }

  const questions = await getExamQuestions(id);

  // สำคัญ: ห้ามส่ง correct_index / explanation ออกไปตอนเริ่มทำข้อสอบ เพื่อไม่ให้เฉลยรั่วก่อนส่งคำตอบ
  const safeQuestions = questions.map((q) => ({
    id: q.id,
    question_type: q.question_type,
    audio_path: q.audio_path,
    question_text: q.question_text,
    choices: q.choices,
  }));

  return NextResponse.json({ examSet, questions: safeQuestions });
}
