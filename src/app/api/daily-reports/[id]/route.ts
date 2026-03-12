import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const report = await prisma.dailyReport.findFirst({
    where: { id, facilityId: appUser.facilityId },
    include: { section: { select: { id: true, name: true } } },
  });
  if (!report)
    return NextResponse.json({ error: "Daily report not found" }, { status: 404 });
  return NextResponse.json(report);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const report = await prisma.dailyReport.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!report)
    return NextResponse.json({ error: "Daily report not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  const fields = [
    "importance", "staffEntries", "weather", "highTemp", "lowTemp", "humidity",
    "labelIds", "notes", "subsectionNotes",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }

  const updated = await prisma.dailyReport.update({
    where: { id },
    data: data as Parameters<typeof prisma.dailyReport.update>[0]["data"],
    include: { section: { select: { id: true, name: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const report = await prisma.dailyReport.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!report)
    return NextResponse.json({ error: "Daily report not found" }, { status: 404 });

  await prisma.dailyReport.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
