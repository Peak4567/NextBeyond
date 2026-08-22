import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faUsers,
  faBookOpen,
  faUserGroup,
  faNewspaper,
  faImages,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

export const dynamic = "force-dynamic";

const STAT_TABLES = [
  { table: "users", label: "ผู้ใช้งานทั้งหมด", icon: faUsers },
  { table: "courses", label: "หลักสูตร/คณะ", icon: faBookOpen },
  { table: "team_members", label: "ทีมผู้พัฒนา", icon: faUserGroup },
  { table: "news_articles", label: "ข่าวสาร", icon: faNewspaper },
  { table: "portfolios", label: "พอร์ตโฟลิโอ", icon: faImages },
  { table: "community_discussions", label: "กระทู้พูดคุย", icon: faComments },
] as const;

async function getStats() {
  const results = await Promise.all(
    STAT_TABLES.map(async ({ table, label, icon }) => {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS count FROM \`${table}\``
      );
      return { label, icon, count: rows[0].count as number };
    })
  );
  return results;
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="flex items-center gap-2.5 text-xl font-extrabold text-[#003b73] sm:text-2xl">
        <FontAwesomeIcon icon={faGaugeHigh} className="text-[#005a9c]" />
        แดชบอร์ดระบบหลังบ้าน
      </h1>
      <p className="mt-1 text-sm text-gray-500">ภาพรวมข้อมูลทั้งหมดในระบบ NextBeyond</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-[#005a9c]">
              <FontAwesomeIcon icon={stat.icon} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-[#005a9c] sm:text-3xl">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
