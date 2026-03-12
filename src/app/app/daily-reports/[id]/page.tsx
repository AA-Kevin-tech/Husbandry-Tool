import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DailyReportForm } from "../DailyReportForm";

export default async function DailyReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const { id } = await params;
  const report = await prisma.dailyReport.findFirst({
    where: { id, facilityId: appUser.facilityId },
    include: { section: { select: { id: true, name: true } } },
  });
  if (!report) notFound();

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const notes = (report.notes as Array<{ type?: string; content?: string }>) ?? [];
  const generalNote = notes.find((n) => n.type === "general")?.content ?? "";

  const initial = {
    sectionId: report.sectionId,
    date: report.date.toISOString().slice(0, 10),
    importance: report.importance,
    weather: report.weather,
    highTemp: report.highTemp,
    lowTemp: report.lowTemp,
    humidity: report.humidity,
    notes: generalNote,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Daily report · {report.section.name} · {new Date(report.date).toLocaleDateString()}
        </h1>
        <Link
          href="/app/daily-reports"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to calendar
        </Link>
      </div>
      <DailyReportForm
        sections={sections}
        reportId={id}
        initial={initial}
      />
    </div>
  );
}
