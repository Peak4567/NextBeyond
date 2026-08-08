import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getSettings, updateSettings, type SettingsKey } from "@/lib/settings";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const values: Partial<Record<SettingsKey, string>> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      values[key as SettingsKey] = value;
    }
  }

  await updateSettings(values);
  const settings = await getSettings();
  return NextResponse.json({ settings });
}
