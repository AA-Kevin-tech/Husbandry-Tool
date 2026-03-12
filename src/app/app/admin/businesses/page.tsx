import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { BusinessList } from "./BusinessList";

export default async function BusinessesPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const businesses = await prisma.business.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Business directory</h1>
        <Link
          href="/app/admin/businesses/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add business
        </Link>
      </div>
      <BusinessList businesses={businesses} />
    </div>
  );
}
