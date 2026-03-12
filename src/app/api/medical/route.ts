import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("sectionId")?.trim();
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const cursor = searchParams.get("cursor");

  const records = await prisma.medicalRecord.findMany({
    where: {
      facilityId: appUser.facilityId,
      ...(sectionId
        ? { animal: { sectionId } }
        : {}),
    },
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
    },
    orderBy: { recordDate: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const nextCursor = records.length > limit ? records[limit - 1]?.id : null;
  const list = records.slice(0, limit);

  return NextResponse.json({ records: list, nextCursor });
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    animalId,
    veterinarianId,
    vetVisit,
    routineVaccination,
    recordDate,
    weight,
    weightUnit,
    problemDescription,
    diagnosis,
    treatmentDescription,
    foodGiven,
    foodAmountGiven,
    foodAmountEaten,
    stoolQuality,
    dietInformation,
    note,
    labelIds,
    drugs,
    vaccines,
  } = body as Record<string, unknown>;

  if (!animalId || typeof animalId !== "string")
    return NextResponse.json(
      { error: "animalId is required" },
      { status: 400 }
    );

  const animal = await prisma.animal.findFirst({
    where: { id: animalId, facilityId: appUser.facilityId },
  });
  if (!animal)
    return NextResponse.json(
      { error: "Animal not found" },
      { status: 400 }
    );

  const record = await prisma.medicalRecord.create({
    data: {
      facilityId: appUser.facilityId,
      animalId,
      veterinarianId: veterinarianId && typeof veterinarianId === "string" ? veterinarianId : null,
      vetVisit: !!vetVisit,
      routineVaccination: !!routineVaccination,
      recordDate: recordDate ? new Date(recordDate as string) : new Date(),
      weight: typeof weight === "string" ? weight : null,
      weightUnit: typeof weightUnit === "string" ? weightUnit : null,
      problemDescription: typeof problemDescription === "string" ? problemDescription : null,
      diagnosis: typeof diagnosis === "string" ? diagnosis : null,
      treatmentDescription: typeof treatmentDescription === "string" ? treatmentDescription : null,
      foodGiven: typeof foodGiven === "string" ? foodGiven : null,
      foodAmountGiven: typeof foodAmountGiven === "string" ? foodAmountGiven : null,
      foodAmountEaten: typeof foodAmountEaten === "string" ? foodAmountEaten : null,
      stoolQuality: typeof stoolQuality === "string" ? stoolQuality : null,
      dietInformation: typeof dietInformation === "string" ? dietInformation : null,
      note: typeof note === "string" ? note : null,
      labelIds: Array.isArray(labelIds) ? labelIds : undefined,
    },
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

  if (Array.isArray(drugs) && drugs.length > 0) {
    for (const d of drugs) {
      if (d && typeof d === "object" && "drug" in d) {
        await prisma.medicalRecordDrug.create({
          data: {
            medicalRecordId: record.id,
            drug: (d as { drug?: string }).drug ?? null,
            dosage: (d as { dosage?: string }).dosage ?? null,
            frequency: (d as { frequency?: string }).frequency ?? null,
          },
        });
      }
    }
  }
  if (Array.isArray(vaccines) && vaccines.length > 0) {
    for (const v of vaccines) {
      if (v && typeof v === "object" && "vaccine" in v) {
        await prisma.medicalRecordVaccine.create({
          data: {
            medicalRecordId: record.id,
            vaccine: (v as { vaccine?: string }).vaccine ?? null,
          },
        });
      }
    }
  }

  const full = await prisma.medicalRecord.findUnique({
    where: { id: record.id },
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
  return NextResponse.json(full ?? record);
}
