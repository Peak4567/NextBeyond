"use client";

import { useEffect, useRef, useState } from "react";

interface PdfViewerProps {
  src: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

// แสดงไฟล์ PDF ทุกหน้าแบบเลื่อนดูต่อเนื่อง (หน้าแรกของ PDF = หน้าปก แสดงเป็นหน้าแรกโดยอัตโนมัติ)
// render ฝั่งเบราว์เซอร์ด้วย pdf.js ทั้งหมด ไม่ต้องมีไลบรารีแปลงไฟล์ฝั่งเซิร์ฟเวอร์ (deploy ง่ายบน Linux ทั่วไป)
export default function PdfViewer({ src }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setLoading(true);
      setError("");
      setNumPages(0);
      setRenderedPages(0);
      if (containerRef.current) containerRef.current.innerHTML = "";

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await withTimeout(pdfjsLib.getDocument(src).promise, 20000);
        if (cancelled) return;
        setNumPages(pdf.numPages);
        setLoading(false);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: 1.8 });
          const canvas = document.createElement("canvas");
          canvas.className = "w-full h-auto rounded-sm border border-gray-200 bg-white shadow-lg";
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext("2d");
          if (!context) continue;

          try {
            // ใส่ timeout กันแท็บที่ถูกซ่อนอยู่ตอนโหลดหน้า (rAF ภายในของ pdf.js จะถูกเบราว์เซอร์หน่วงจนค้าง)
            // ถ้าหน้าไหน timeout ให้ข้ามไปหน้าถัดไปแทนที่จะค้างทั้งเล่ม
            await withTimeout(page.render({ canvasContext: context, viewport }).promise, 20000);
          } catch {
            continue;
          }
          if (cancelled) return;

          const wrapper = document.createElement("div");
          wrapper.className = "mx-auto w-full max-w-2xl";
          wrapper.appendChild(canvas);
          const caption = document.createElement("p");
          caption.className = "mt-1.5 text-center text-[10px] font-semibold text-gray-400";
          caption.textContent = `หน้า ${pageNum} / ${pdf.numPages}`;
          wrapper.appendChild(caption);

          containerRef.current?.appendChild(wrapper);
          setRenderedPages(pageNum);
        }
      } catch (err) {
        if (!cancelled) {
          setError("ไม่สามารถอ่านไฟล์ PDF นี้ได้ ไฟล์อาจเสียหายหรือไม่ใช่ไฟล์ PDF ที่ถูกต้อง");
          setLoading(false);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="space-y-8">
      {numPages > 0 && (
        <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          เนื้อหาภายในเล่ม ({numPages} หน้า) — เลื่อนลงเพื่อดูทุกหน้า
          {renderedPages < numPages && ` (กำลังโหลด ${renderedPages}/${numPages})`}
        </p>
      )}
      {loading && (
        <p className="py-6 text-center text-xs text-gray-400">กำลังเปิดไฟล์ PDF...</p>
      )}
      {error && (
        <p className="rounded-xl border border-dashed border-red-200 bg-red-50 p-6 text-center text-xs text-red-500">
          {error}
        </p>
      )}
      <div ref={containerRef} className="space-y-8" />
    </div>
  );
}
