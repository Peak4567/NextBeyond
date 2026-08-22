"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid, faEye, faComments } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

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
  cover_image?: string | null;
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

        {/* --- ปกเล่ม Portfolio ขนาด A4 --- */}
        <div className="mt-4 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-md bg-gray-300/60 aspect-[210/297]" />
            <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-md border border-gray-200 bg-gray-100 aspect-[210/297]" />
            <div
              className={`relative flex aspect-[210/297] w-full flex-col justify-end overflow-hidden rounded-md border border-gray-200 p-6 text-white shadow-xl ${
                portfolio.cover_image ? "" : `bg-gradient-to-br ${portfolio.cover_bg}`
              }`}
            >
              {portfolio.cover_image && (
                <img
                  src={portfolio.cover_image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="relative z-10">
                <span className="rounded-xl bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm">
                  {portfolio.faculty} • {portfolio.university}
                </span>
                <h1 className="mt-3 text-xl font-extrabold leading-snug sm:text-2xl">{portfolio.title}</h1>
                <p className="mt-1 text-xs text-white/80">
                  {portfolio.student_name} • {portfolio.school}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          หน้าปก Portfolio ขนาด A4
        </p>

        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          {portfolio.tags && (
            <div className="flex flex-wrap gap-1.5">
              {portfolio.tags.split(",").map((tag, i) => (
                <span key={i} className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                likedByMe ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500 hover:bg-rose-100"
              }`}
            >
              <FontAwesomeIcon icon={likedByMe ? faHeartSolid : faHeartRegular} />
              {likedByMe ? "ถูกใจแล้ว" : "กดถูกใจ"} • {likeCount}
            </button>
            <span className="text-xs text-gray-400">
              <FontAwesomeIcon icon={faEye} /> {portfolio.views}
            </span>
          </div>
        </div>

        {/* --- เนื้อหาภายในเล่ม แสดงเป็นหน้ากระดาษ A4 ทีละหน้า --- */}
        {images.length > 0 && (
          <div className="mt-8 space-y-8">
            <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              เนื้อหาภายในเล่ม ({images.length} หน้า)
            </p>
            {images.map((img, index) => (
              <div key={img.id} className="mx-auto w-full max-w-2xl">
                <div className="aspect-[210/297] w-full overflow-hidden rounded-sm border border-gray-200 bg-white shadow-lg">
                  <img src={img.image_path} alt="" className="h-full w-full object-contain" />
                </div>
                <p className="mt-1.5 text-center text-[10px] font-semibold text-gray-400">หน้า {index + 1}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comments */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#003b73]">
            <FontAwesomeIcon icon={faComments} className="text-blue-500" /> แสดงความคิดเห็น ({comments.length})
          </h2>

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
