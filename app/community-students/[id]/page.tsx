"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PortfolioDetail {
  id: number;
  title: string;
  student_name: string;
  school: string;
  faculty: string;
  university: string;
  views: string;
  likes: number;
  tags: string;
  cover_bg: string;
}

interface PortfolioImg {
  id: number;
  image_path: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorName: string;
}

export default function PortfolioDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<PortfolioDetail | null | undefined>(undefined);
  const [images, setImages] = useState<PortfolioImg[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedByMe, setLikedByMe] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function load() {
    const [detailRes, meRes] = await Promise.all([
      fetch(`/api/portfolio/${params.id}`),
      fetch("/api/auth/me"),
    ]);
    const detailData = await detailRes.json();
    const meData = await meRes.json();

    setIsLoggedIn(Boolean(meData.user));

    if (!detailRes.ok) {
      setPortfolio(null);
      return;
    }

    setPortfolio(detailData.portfolio);
    setImages(detailData.images);
    setComments(detailData.comments);
    setLikedByMe(detailData.likedByMe);
    setLikeCount(detailData.portfolio.likes);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleLike() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const res = await fetch(`/api/portfolio/${params.id}/like`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setLikedByMe(data.liked);
      setLikeCount(data.likes);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!commentText.trim()) return;

    setPosting(true);
    setError("");
    const res = await fetch(`/api/portfolio/${params.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "แสดงความคิดเห็นไม่สำเร็จ");
    } else {
      setComments(data.comments);
      setCommentText("");
    }
    setPosting(false);
  }

  if (portfolio === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-sm text-gray-400">กำลังโหลด...</main>
        <Footer />
      </div>
    );
  }

  if (portfolio === null) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-gray-400">
          <p>ไม่พบเล่มผลงานนี้ หรือยังไม่ได้รับการอนุมัติ</p>
          <Link href="/community-students" className="font-bold text-blue-600 hover:underline">
            ← กลับไปหน้าชุมชนนักเรียน
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 lg:px-8">
        <Link href="/community-students" className="text-xs font-semibold text-blue-600 hover:underline">
          ← กลับไปหน้าชุมชนนักเรียน
        </Link>

        <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600">
            {portfolio.faculty} • {portfolio.university}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-[#003b73]">{portfolio.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {portfolio.student_name} • {portfolio.school}
          </p>

          {portfolio.tags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {portfolio.tags.split(",").map((tag, i) => (
                <span key={i} className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                likedByMe ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500 hover:bg-rose-100"
              }`}
            >
              {likedByMe ? "❤️ ถูกใจแล้ว" : "🤍 กดถูกใจ"} • {likeCount}
            </button>
            <span className="text-xs text-gray-400">👁️ {portfolio.views}</span>
          </div>

          {/* Image gallery */}
          <div className="mt-6 space-y-4">
            {images.length > 0 ? (
              images.map((img) => (
                <img
                  key={img.id}
                  src={img.image_path}
                  alt=""
                  className="w-full rounded-2xl border border-gray-100 object-cover"
                />
              ))
            ) : (
              <div className={`flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${portfolio.cover_bg} text-sm font-bold text-white`}>
                {portfolio.title}
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#003b73]">💬 แสดงความคิดเห็น ({comments.length})</h2>

          <form onSubmit={handleComment} className="mt-4 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isLoggedIn ? "แสดงความคิดเห็น..." : "เข้าสู่ระบบเพื่อแสดงความคิดเห็น"}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={posting}
              className="rounded-xl bg-[#002b55] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#004b8d] disabled:opacity-60"
            >
              ส่ง
            </button>
          </form>
          {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}

          <div className="mt-5 space-y-4">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400">ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นสิ!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border-b border-gray-50 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">{c.authorName}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(c.createdAt).toLocaleString("th-TH")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
