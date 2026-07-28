"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faRightToBracket,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password, rememberMe });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      {/* Navbar ด้านบนสุด */}
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container - ความมน rounded-xl พร้อมเงา shadow-xl */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-all">
            
            {/* Header Card */}
            <div className="bg-gradient-to-br from-[#002b55] via-[#004b8d] to-[#0066c4] p-8 text-center text-white">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-amber-300 backdrop-blur-md shadow-inner border border-white/20">
                <FontAwesomeIcon icon={faGraduationCap} className="text-2xl" />
              </div>
              <h1 className="mt-4 text-2xl font-black">ยินดีต้อนรับกลับมา!</h1>
              <p className="mt-1 text-xs text-blue-100 opacity-90">
                เข้าสู่ระบบเพื่อใช้งานคลังข้อสอบและวางแผน TCAS ของคุณ
              </p>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
                >
                  <FontAwesomeIcon icon={faGoogle} className="text-red-500" /> Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="text-blue-600" /> Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center justify-between">
                <span className="h-[1px] w-full bg-gray-200" />
                <span className="shrink-0 px-3 text-[11px] font-semibold text-gray-400">
                  หรือเข้าสู่ระบบด้วยอีเมล
                </span>
                <span className="h-[1px] w-full bg-gray-200" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    อีเมลประจำตัว
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs text-gray-800 outline-none shadow-sm transition-all focus:border-[#004b8d] focus:bg-white focus:shadow-md"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      รหัสผ่าน
                    </label>
                    <a href="#" className="text-[11px] font-bold text-[#004b8d] hover:underline">
                      ลืมรหัสผ่าน?
                    </a>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-10 text-xs text-gray-800 outline-none shadow-sm transition-all focus:border-[#004b8d] focus:bg-white focus:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#004b8d] focus:ring-[#004b8d]"
                    />
                    <span>จดจำการเข้าสู่ระบบ</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#002b55] py-3 text-xs font-extrabold text-white shadow-lg transition-all hover:bg-[#004b8d] hover:shadow-xl hover:scale-[1.01]"
                >
                  <FontAwesomeIcon icon={faRightToBracket} /> เข้าสู่ระบบ
                </button>
              </form>

              {/* Register Redirect Link */}
              <div className="mt-6 text-center text-xs text-gray-500">
                ยังไม่มีบัญชีสมาชิก?{" "}
                <Link href="/register" className="font-bold text-[#004b8d] hover:underline">
                  สมัครสมาชิกใหม่ที่นี่
                </Link>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <p className="mt-6 text-center text-[11px] text-gray-400">
            © 2026 NextBeyond. ระบบปลอดภัยด้วยการเข้ารหัสข้อมูล SSL
          </p>
        </div>
      </main>

      {/* Footer ด้านล่างสุด */}
      <Footer />
    </div>
  );
}