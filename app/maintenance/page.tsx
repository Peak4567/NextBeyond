import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#002b55] px-6 text-center text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
        🛠️
      </div>
      <h1 className="mt-6 text-2xl font-extrabold sm:text-3xl">{settings.site_title}</h1>
      <p className="mt-3 max-w-md text-sm text-blue-100">{settings.maintenance_message}</p>
    </div>
  );
}
