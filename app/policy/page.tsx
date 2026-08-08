import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function PolicyPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 lg:px-8">
        <h1 className="text-2xl font-extrabold text-[#003b73] sm:text-3xl">เงื่อนไขและนโยบาย</h1>

        <div className="mt-6 whitespace-pre-line rounded-3xl border border-gray-200 bg-white p-6 text-sm leading-relaxed text-gray-600 shadow-sm sm:p-8">
          {settings.policy_content}
        </div>
      </main>

      <Footer />
    </div>
  );
}
