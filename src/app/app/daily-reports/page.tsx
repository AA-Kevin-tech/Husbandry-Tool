import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { DailyReportsCalendar } from "./DailyReportsCalendar";

export default async function DailyReportsPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const sections = await prisma.section.findMany({
    where: {
      facilityId: appUser.facilityId,
      dailyReportsEnabled: true,
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (sections.length === 0) {
    const allSections = await prisma.section.findMany({
      where: { facilityId: appUser.facilityId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Daily reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enable daily reports for at least one section in Section management (edit section → enable daily reports).
        </p>
        <DailyReportsCalendar sections={allSections} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Daily reports</h1>
      <DailyReportsCalendar sections={sections} />
    </div>
  );
}
