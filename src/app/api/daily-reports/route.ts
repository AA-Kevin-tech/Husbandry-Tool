import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId")?.trim();
  const from = searchParams.get("from")?.trim();
  const to = searchParams.get("to")?.trim();

  if (!sectionId)
    return NextResponse.json(
      { error: "sectionId is required" },
      { status: 400 }
    );

  const section = await prisma.section.findFirst({
    where: { id: sectionId, facilityId: appUser.facilityId },
  });
  if (!section)
    return NextResponse.json(
      { error: "Section not found" },
      { status: 404 }
    );

  const fromDate = from ? new Date(from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = to ? new Date(to) : new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);

  const reports = await prisma.dailyReport.findMany({
    where: {
      sectionId,
      date: { gte: fromDate, lte: toDate },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    sectionId,
    date,
    importance,
    staffEntries,
    weather,
    highTemp,
    lowTemp,
    humidity,
    labelIds,
    notes,
    subsectionNotes,
  } = body as Record<string, unknown>;

  if (!sectionId || typeof sectionId !== "string")
    return NextResponse.json(
      { error: "sectionId is required" },
      { status: 400 }
    );
  if (!date)
    return NextResponse.json(
      { error: "date is required" },
      { status: 400 }
    );

  const section = await prisma.section.findFirst({
    where: { id: sectionId, facilityId: appUser.facilityId },
  });
  if (!section)
    return NextResponse.json(
      { error: "Section not found" },
      { status: 400 }
    );

  const reportDate = new Date(date as string);
  reportDate.setHours(0, 0, 0, 0);

  const existing = await prisma.dailyReport.findUnique({
    where: { sectionId_date: { sectionId, date: reportDate } },
  });
  if (existing)
    return NextResponse.json(
      { error: "A report already exists for this section and date" },
      { status: 409 }
    );

  const report = await prisma.dailyReport.create({
    data: {
      facilityId: appUser.facilityId,
      sectionId,
      date: reportDate,
      importance: importance === "Important" || importance === "Critical" ? (importance as string) : "Normal",
      staffEntries: Array.isArray(staffEntries) ? staffEntries : undefined,
      weather: typeof weather === "string" ? weather : null,
      highTemp: typeof highTemp === "string" ? highTemp : null,
      lowTemp: typeof lowTemp === "string" ? lowTemp : null,
      humidity: typeof humidity === "string" ? humidity : null,
      labelIds: Array.isArray(labelIds) ? labelIds : undefined,
      notes: Array.isArray(notes) ? notes : undefined,
      subsectionNotes: Array.isArray(subsectionNotes) ? subsectionNotes : undefined,
    },
  });

  return NextResponse.json(report);
}
