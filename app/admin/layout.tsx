import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb] md:flex-row">
      <AdminSidebar userName={user.fullName} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
