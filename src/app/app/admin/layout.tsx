import Link from "next/link";
import { getAppUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appUser = await getAppUser();
  if (!appUser) redirect("/login");
  if (appUser.role !== "Admin") redirect("/app");

  const nav = [
    { href: "/app/admin", label: "Overview" },
    { href: "/app/admin/settings", label: "App settings" },
    { href: "/app/admin/facility", label: "Facility setup" },
    { href: "/app/admin/labels", label: "Labels" },
    { href: "/app/admin/custom-lists", label: "Custom lists" },
    { href: "/app/admin/users", label: "User management" },
    { href: "/app/admin/businesses", label: "Business directory" },
  ];

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 border-b pb-2">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
          >
            {label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
