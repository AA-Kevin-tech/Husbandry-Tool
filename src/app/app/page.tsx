import { redirect } from "next/navigation";
import { getAppUser } from "@/lib/auth-server";

export default async function AppHomePage() {
  const appUser = await getAppUser();
  if (!appUser) redirect("/login?next=/app");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome to {appUser.facilityName}. Use the sidebar to open Sections,
        Animals, Medical records, Daily reports, or Chat.
      </p>
    </div>
  );
}
