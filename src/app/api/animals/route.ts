import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const disposition = searchParams.get("disposition")?.trim();
  const sectionId = searchParams.get("sectionId")?.trim();
  const q = searchParams.get("q")?.trim();

  const animals = await prisma.animal.findMany({
    where: {
      facilityId: appUser.facilityId,
      ...(disposition ? { disposition } : {}),
      ...(sectionId ? { sectionId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { note: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      section: { select: { id: true, name: true } },
      species: { select: { id: true, binomial: true, commonName: true } },
    },
    orderBy: [{ section: { name: "asc" } }, { name: "asc" }],
  });

  return NextResponse.json(animals);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    sectionId,
    speciesId,
    name,
    identifiers,
    disposition,
    dispositionDate,
    dispositionNote,
    birthDate,
    birthDateEstimate,
    weight,
    weightUnit,
    gender,
    breedingStatus,
    primaryColor,
    secondaryColor,
    uniqueMarkings,
    note,
    labelIds,
    acquisitionDate,
    acquisitionMethod,
    acquisitionPrice,
    acquisitionSourceId,
    acquisitionDiet,
    acquisitionNote,
    transferDate,
    transferMethod,
    transferPrice,
    transferDestId,
    transferNote,
  } = body as Record<string, unknown>;

  if (!sectionId || typeof sectionId !== "string")
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
      { status: 400 }
    );

  const animal = await prisma.animal.create({
    data: {
      facilityId: appUser.facilityId,
      sectionId,
      speciesId: speciesId && typeof speciesId === "string" ? speciesId : null,
      name: typeof name === "string" ? name : null,
      identifiers: Array.isArray(identifiers) ? identifiers : undefined,
      disposition: typeof disposition === "string" ? disposition : null,
      dispositionDate: dispositionDate ? new Date(dispositionDate as string) : null,
      dispositionNote: typeof dispositionNote === "string" ? dispositionNote : null,
      birthDate: birthDate ? new Date(birthDate as string) : null,
      birthDateEstimate: !!birthDateEstimate,
      weight: typeof weight === "string" ? weight : null,
      weightUnit: typeof weightUnit === "string" ? weightUnit : null,
      gender: typeof gender === "string" ? gender : null,
      breedingStatus: typeof breedingStatus === "string" ? breedingStatus : null,
      primaryColor: typeof primaryColor === "string" ? primaryColor : null,
      secondaryColor: typeof secondaryColor === "string" ? secondaryColor : null,
      uniqueMarkings: typeof uniqueMarkings === "string" ? uniqueMarkings : null,
      note: typeof note === "string" ? note : null,
      labelIds: Array.isArray(labelIds) ? labelIds : undefined,
      acquisitionDate: acquisitionDate ? new Date(acquisitionDate as string) : null,
      acquisitionMethod: typeof acquisitionMethod === "string" ? acquisitionMethod : null,
      acquisitionPrice: typeof acquisitionPrice === "string" ? acquisitionPrice : null,
      acquisitionSourceId: typeof acquisitionSourceId === "string" ? acquisitionSourceId : null,
      acquisitionDiet: typeof acquisitionDiet === "string" ? acquisitionDiet : null,
      acquisitionNote: typeof acquisitionNote === "string" ? acquisitionNote : null,
      transferDate: transferDate ? new Date(transferDate as string) : null,
      transferMethod: typeof transferMethod === "string" ? transferMethod : null,
      transferPrice: typeof transferPrice === "string" ? transferPrice : null,
      transferDestId: typeof transferDestId === "string" ? transferDestId : null,
      transferNote: typeof transferNote === "string" ? transferNote : null,
    },
    include: {
      section: { select: { id: true, name: true } },
      species: { select: { id: true, binomial: true, commonName: true } },
    },
  });

  return NextResponse.json(animal);
}
