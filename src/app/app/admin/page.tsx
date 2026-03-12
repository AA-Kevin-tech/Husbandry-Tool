import { getAppUser } from "@/lib/auth-server";
import Link from "next/link";

export default async function AdminPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Administration</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Manage facility settings, labels, custom lists, users, and business directory.
      </p>
      <ul className="space-y-2">
        <li><Link href="/app/admin/settings" className="text-blue-600 hover:underline">App settings</Link> – Start of week, measurement system, date/time format</li>
        <li><Link href="/app/admin/facility" className="text-blue-600 hover:underline">Facility setup</Link> – Name, contact, address</li>
        <li><Link href="/app/admin/labels" className="text-blue-600 hover:underline">Labels</Link> – Custom labels for animals, sections, medical, daily reports</li>
        <li><Link href="/app/admin/custom-lists" className="text-blue-600 hover:underline">Custom lists</Link> – Dropdown values (disposition, gender, drugs, etc.)</li>
        <li><Link href="/app/admin/users" className="text-blue-600 hover:underline">User management</Link> – Facility members and roles</li>
        <li><Link href="/app/admin/businesses" className="text-blue-600 hover:underline">Business directory</Link> – Veterinarians, dealers, exhibitors</li>
      </ul>
    </div>
  );
}
