"use client";

import { useEffect } from "react";

const FALLBACK_SRC = "/img/image-fallback.svg";

// จับ error ของรูปภาพทุกรูปทั้งเว็บแบบรวมศูนย์ (event delegation)
// แทนที่จะต้องไปเพิ่ม onError ทีละ <img> หลายสิบจุดทั่วเว็บ
export default function ImageErrorFallback() {
  useEffect(() => {
    function handleImageError(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.dataset.fallbackApplied === "1") return; // กันวนซ้ำถ้ารูป fallback เองโหลดไม่ขึ้น
      if (target.dataset.noFallback === "true") return; // จุดที่มี fallback ของตัวเองอยู่แล้ว (เช่นโลโก้มหาวิทยาลัย) ไม่ต้องแทรก

      target.dataset.fallbackApplied = "1";
      target.src = FALLBACK_SRC;
      target.srcset = "";
    }

    // "error" ของ <img> ไม่ bubble ขึ้นมา ต้องดักด้วย capture phase ที่ document
    document.addEventListener("error", handleImageError, true);
    return () => document.removeEventListener("error", handleImageError, true);
  }, []);

  return null;
}
