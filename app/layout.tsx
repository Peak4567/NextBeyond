import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import ImageErrorFallback from "@/components/ImageErrorFallback";

// ปิดการแทรก CSS ของ FontAwesome แบบ runtime (autoAddCss) แล้วใช้ CSS ไฟล์จริงแทน
// ป้องกันปัญหาไอคอนกะพริบเป็นบล็อกสี่เหลี่ยม/ไม่มีขนาดตอนโหลดหน้าครั้งแรกหรือหลัง Fast Refresh
config.autoAddCss = false;

const noto = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.seo_title,
    description: settings.seo_description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <html
      lang="th"
      className={`${noto.variable} ${settings.theme_default === "dark" ? "dark" : ""}`}
    >
      <body className="font-sans antialiased">
        <ImageErrorFallback />
        {children}
      </body>
    </html>
  );
}
