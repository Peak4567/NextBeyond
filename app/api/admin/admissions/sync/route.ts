import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { runAdmissionSync } from "@/lib/tcasSync";

export async function POST() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  try {
    const result = await runAdmissionSync();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "ซิงค์ข้อมูลไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
