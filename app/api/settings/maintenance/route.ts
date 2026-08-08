import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const [settings, user] = await Promise.all([getSettings(), getSessionUser()]);

  return NextResponse.json({
    maintenance: settings.maintenance_mode === "1",
    bypass: user?.role === "admin",
  });
}
