import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNewsArticleById, getNewsBlocks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const article = await getNewsArticleById(id);
  if (!article) notFound();

  const blocks = await getNewsBlocks(id);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 lg:px-8">
        <Link href="/news" className="text-xs font-semibold text-blue-600 hover:underline">
          ← กลับไปหน้าข่าวสาร
        </Link>

        <article className="mt-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600">
            {article.category}
          </span>
          <h1 className="mt-3 text-2xl font-black text-[#002b55] sm:text-3xl">{article.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span>{article.article_date}</span>
            <span>•</span>
            <span>อ่าน {article.read_time}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>

          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt=""
              className="mt-6 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className={`mt-6 flex h-56 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${article.image_color} text-sm font-bold text-white`}>
              {article.title}
            </div>
          )}

          <p className="mt-6 text-sm leading-relaxed text-gray-600">{article.excerpt}</p>

          <div className="mt-6 space-y-5">
            {blocks.map((block) =>
              block.block_type === "image" && block.image_path ? (
                <img
                  key={block.id}
                  src={block.image_path}
                  alt=""
                  className="w-full rounded-2xl border border-gray-100 object-cover"
                />
              ) : block.block_type === "text" ? (
                <p
                  key={block.id}
                  className={`text-sm leading-relaxed text-gray-700 ${block.is_bold ? "font-bold" : ""} ${block.is_italic ? "italic" : ""}`}
                >
                  {block.text_content}
                </p>
              ) : null
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
