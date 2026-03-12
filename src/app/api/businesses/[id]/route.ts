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
  const business = await prisma.business.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!business)
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  return NextResponse.json(business);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const business = await prisma.business.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!business)
    return NextResponse.json({ error: "Business not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  const fields = [
    "type", "name", "owner", "contactName", "contactEmail",
    "mailingAddress", "physicalAddress", "websiteUrl", "note", "labelIds",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }

  const updated = await prisma.business.update({
    where: { id },
    data: data as Parameters<typeof prisma.business.update>[0]["data"],
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
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const business = await prisma.business.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!business)
    return NextResponse.json({ error: "Business not found" }, { status: 404 });

  await prisma.business.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
