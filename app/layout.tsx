import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "NextBeyond | ก้าวเข้าสู่รั้วมหาวิทยาลัย",
  description: "ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัยกับ NextBeyond",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={noto.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
