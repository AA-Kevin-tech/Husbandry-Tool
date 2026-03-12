import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppUser } from "@/lib/auth-server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appUser = await getAppUser();
  if (!appUser) redirect("/login?next=/app");

  const nav = [
    { href: "/app", label: "Home" },
    { href: "/app/sections", label: "Sections" },
    { href: "/app/chat", label: "Chat" },
    { href: "/app/animals", label: "Animals" },
    { href: "/app/medical", label: "Medical records" },
    { href: "/app/daily-reports", label: "Daily reports" },
    { href: "/app/reports", label: "Reports" },
    { href: "/app/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r p-4 flex flex-col">
        <div className="font-semibold mb-2">{appUser.facilityName}</div>
        <nav className="flex flex-col gap-1">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t text-sm text-gray-500">
          {appUser.email}
        </div>
        <form action="/logout" method="post">
          <button type="submit" className="mt-2 text-sm text-blue-600 hover:underline">
            Log out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
