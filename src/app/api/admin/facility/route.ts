import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET() {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const facility = await prisma.facility.findUnique({
    where: { id: appUser.facilityId },
  });
  if (!facility)
    return NextResponse.json({ error: "Facility not found" }, { status: 404 });
  return NextResponse.json(facility);
}

export async function PATCH(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  const fields = [
    "name", "dba", "owner", "contactName", "contactEmail", "contactPhone",
    "mailingAddress", "settings",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }

  const facility = await prisma.facility.update({
    where: { id: appUser.facilityId },
    data: data as Parameters<typeof prisma.facility.update>[0]["data"],
  });
  return NextResponse.json(facility);
}
