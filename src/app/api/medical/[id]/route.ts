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
  const record = await prisma.medicalRecord.findFirst({
    where: { id, facilityId: appUser.facilityId },
    include: {
      animal: {
        select: {
          id: true,
          name: true,
          section: { select: { id: true, name: true } },
          species: { select: { commonName: true, binomial: true } },
        },
      },
      veterinarian: { select: { id: true, name: true } },
      drugs: true,
      vaccines: true,
    },
  });
  if (!record)
    return NextResponse.json({ error: "Medical record not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const record = await prisma.medicalRecord.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!record)
    return NextResponse.json({ error: "Medical record not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  const fields = [
    "animalId", "veterinarianId", "vetVisit", "routineVaccination", "recordDate",
    "weight", "weightUnit", "problemDescription", "diagnosis", "treatmentDescription",
    "foodGiven", "foodAmountGiven", "foodAmountEaten", "stoolQuality", "dietInformation",
    "note", "labelIds",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (data.recordDate && typeof data.recordDate === "string")
    data.recordDate = new Date(data.recordDate);
  if (data.animalId) {
    const animal = await prisma.animal.findFirst({
      where: { id: data.animalId as string, facilityId: appUser.facilityId },
    });
    if (!animal)
      return NextResponse.json({ error: "Animal not found" }, { status: 400 });
  }

  const updated = await prisma.medicalRecord.update({
    where: { id },
    data: data as Parameters<typeof prisma.medicalRecord.update>[0]["data"],
    include: {
      animal: {
        select: {
          id: true,
          name: true,
          section: { select: { name: true } },
          species: { select: { commonName: true } },
        },
      },
      veterinarian: { select: { id: true, name: true } },
      drugs: true,
      vaccines: true,
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
  const record = await prisma.medicalRecord.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!record)
    return NextResponse.json({ error: "Medical record not found" }, { status: 404 });

  await prisma.medicalRecord.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
