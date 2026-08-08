import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "sweetalert2/dist/sweetalert2.min.css";
import "./globals.css";
import { getSettings } from "@/lib/settings";

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
