import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DailyReportForm } from "../DailyReportForm";

export default async function NewDailyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sectionId?: string; date?: string }>;
}) {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const { sectionId: qSectionId, date: qDate } = await searchParams;
  if (!qSectionId || !qDate) redirect("/app/daily-reports");

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">New daily report</h1>
      <DailyReportForm
        sections={sections}
        defaultSectionId={qSectionId}
        defaultDate={qDate}
      />
    </div>
  );
}
