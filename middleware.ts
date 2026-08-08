import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const bypassPaths = ["/maintenance", "/admin", "/login", "/register", "/api"];
  if (bypassPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    const checkUrl = new URL("/api/settings/maintenance", request.url);
    const response = await fetch(checkUrl, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    const data = await response.json();

    if (data.maintenance && !data.bypass) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  } catch {
    // ถ้าตรวจสอบสถานะไม่ได้ ให้ปล่อยผ่านตามปกติ ไม่บล็อกผู้ใช้
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img/|uploads/).*)"],
};
