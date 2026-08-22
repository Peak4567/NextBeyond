import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { ADMIN_RESOURCES } from "@/lib/adminResources";

export default function AdminContentOverviewPage() {
  return (
    <div>
      <h1 className="flex items-center gap-2.5 text-xl font-extrabold text-[#003b73] sm:text-2xl">
        <FontAwesomeIcon icon={faLayerGroup} className="text-[#005a9c]" />
        จัดการเนื้อหาเว็บไซต์
      </h1>
      <p className="mt-1 text-sm text-gray-500">เลือกประเภทข้อมูลที่ต้องการเพิ่ม/ลบ</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(ADMIN_RESOURCES).map(([key, config]) => (
          <Link
            key={key}
            href={`/admin/content/${key}`}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#005a9c]">
              <FontAwesomeIcon icon={config.icon} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#005a9c]">{config.label}</h3>
              <p className="mt-1 text-xs text-gray-400">{config.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
