/** @type {import('next').NextConfig} */
const nextConfig = {
  // สร้างเซิร์ฟเวอร์ Node.js แบบพกพา (.next/standalone) ที่รวมเฉพาะ dependency ที่จำเป็นจริงๆ
  // ทำให้ deploy ไปเซิร์ฟเวอร์ Linux/Docker ได้ง่ายโดยไม่ต้อง copy node_modules ทั้งหมด
  output: "standalone",
};

export default nextConfig;
