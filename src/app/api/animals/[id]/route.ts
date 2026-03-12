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
  const animal = await prisma.animal.findFirst({
    where: { id, facilityId: appUser.facilityId },
    include: {
      section: { select: { id: true, name: true } },
      species: { select: { id: true, binomial: true, commonName: true } },
    },
  });
  if (!animal)
    return NextResponse.json({ error: "Animal not found" }, { status: 404 });
  return NextResponse.json(animal);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const animal = await prisma.animal.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!animal)
    return NextResponse.json({ error: "Animal not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  const fields = [
    "sectionId", "speciesId", "name", "identifiers", "disposition",
    "dispositionDate", "dispositionNote", "birthDate", "birthDateEstimate",
    "weight", "weightUnit", "gender", "breedingStatus", "primaryColor",
    "secondaryColor", "uniqueMarkings", "note", "labelIds",
    "acquisitionDate", "acquisitionMethod", "acquisitionPrice", "acquisitionSourceId",
    "acquisitionDiet", "acquisitionNote", "transferDate", "transferMethod",
    "transferPrice", "transferDestId", "transferNote",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  const dateFields = ["dispositionDate", "birthDate", "acquisitionDate", "transferDate"];
  for (const f of dateFields) {
    if (data[f] && typeof data[f] === "string") data[f] = new Date(data[f] as string);
  }
  if (data.sectionId) {
    const section = await prisma.section.findFirst({
      where: { id: data.sectionId as string, facilityId: appUser.facilityId },
    });
    if (!section)
      return NextResponse.json({ error: "Section not found" }, { status: 400 });
  }

  const updated = await prisma.animal.update({
    where: { id },
    data: data as Parameters<typeof prisma.animal.update>[0]["data"],
    include: {
      section: { select: { id: true, name: true } },
      species: { select: { id: true, binomial: true, commonName: true } },
    },
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
  const animal = await prisma.animal.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!animal)
    return NextResponse.json({ error: "Animal not found" }, { status: 404 });

  await prisma.animal.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
