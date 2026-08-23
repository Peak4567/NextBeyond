# NextBeyond

ระบบแนะแนวและวางแผนเข้ามหาวิทยาลัย (Next.js + MySQL)

## ความต้องการของระบบ

- Node.js 18.17+ หรือ 20+
- MySQL 8+ (หรือ MariaDB ที่รองรับ)

## ติดตั้งและรันบนเครื่อง dev

```bash
npm install
cp .env.example .env.local   # แล้วแก้ DB_USER / DB_PASSWORD ให้ตรงกับเครื่องจริง
```

สร้างฐานข้อมูลและตารางจาก `db/schema.sql` แล้วรัน migration ทั้งหมดใน `db/migrations/` ตามลำดับเลขไฟล์

```bash
npm run dev
```

## Deploy บนเซิร์ฟเวอร์ Linux (หรือเซิร์ฟเวอร์อื่น)

1. Clone โค้ดขึ้นเซิร์ฟเวอร์ แล้วสร้างไฟล์ `.env.production` (คัดลอกจาก `.env.example`) ใส่ค่า `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` ของฐานข้อมูลจริงบนเซิร์ฟเวอร์
2. ติดตั้ง dependency และ build:
   ```bash
   npm install
   npm run build
   ```
3. โปรเจกต์ตั้งค่า `output: "standalone"` ไว้แล้ว (ดู `next.config.mjs`) หลัง build จะได้โฟลเดอร์ `.next/standalone` ที่รวมเฉพาะไฟล์ที่จำเป็นสำหรับรัน ไม่ต้อง copy `node_modules` ทั้งหมดขึ้นเซิร์ฟเวอร์
   ต้อง copy โฟลเดอร์ static เพิ่มเข้าไปในนั้นเองก่อนรัน (standalone mode ไม่รวมให้อัตโนมัติ):
   ```bash
   cp -r public .next/standalone/public
   cp -r .next/static .next/standalone/.next/static
   ```
4. รันเซิร์ฟเวอร์:
   ```bash
   node .next/standalone/server.js
   ```
   ค่า default คือ port 3000 ตั้ง `PORT=` และ `HOSTNAME=` ได้ผ่าน environment variable ถ้าต้องการเปลี่ยน
5. แนะนำให้ตั้ง process manager (เช่น `pm2` หรือ `systemd`) ให้รันคำสั่งด้านบนแบบถาวร และตั้ง reverse proxy (nginx) ชี้มาที่ port ของแอป พร้อม HTTPS จริง — ระบบ login ตั้ง cookie แบบ `secure` เมื่อ `NODE_ENV=production` จึงต้องรันผ่าน HTTPS ถึงจะ login ได้

## อัปโหลดไฟล์

รูปที่อัปโหลด (portfolio, ข่าว, การตั้งค่า) จะถูกบันทึกไว้ที่ `public/uploads/<โฟลเดอร์>` บนเซิร์ฟเวอร์ ถ้า deploy ด้วย standalone ต้องแน่ใจว่าโฟลเดอร์ `public/uploads` ที่ copy ไปด้วยเขียนไฟล์ได้ (permission) และเก็บข้อมูลถาวรอยู่นอก container/deployment ที่ลบทิ้งได้ทุกครั้งที่ deploy ใหม่ (เช่น mount เป็น volume แยก)
