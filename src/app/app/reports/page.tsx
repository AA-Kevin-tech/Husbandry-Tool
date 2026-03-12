import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function ReportsPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { animals: true } },
    },
  });

  const totalAnimals = sections.reduce((sum, s) => sum + s._count.animals, 0);
  const medicalCount = await prisma.medicalRecord.count({
    where: { facilityId: appUser.facilityId },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mb-8">
        <div className="border rounded-lg p-4">
          <h2 className="font-medium text-gray-500 dark:text-gray-400">Total animals</h2>
          <p className="text-2xl font-semibold">{totalAnimals}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="font-medium text-gray-500 dark:text-gray-400">Medical records</h2>
          <p className="text-2xl font-semibold">{medicalCount}</p>
        </div>
      </div>
      <div>
        <h2 className="font-medium mb-2">Animals by section</h2>
        <table className="w-full max-w-md border-collapse border">
          <thead>
            <tr className="border-b bg-gray-50 dark:bg-gray-800">
              <th className="text-left p-2">Section</th>
              <th className="text-right p-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2">
                  <Link href={`/app/animals?sectionId=${s.id}`} className="text-blue-600 hover:underline">
                    {s.name}
                  </Link>
                </td>
                <td className="p-2 text-right">{s._count.animals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
