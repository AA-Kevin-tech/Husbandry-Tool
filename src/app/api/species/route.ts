import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const species = await prisma.species.findMany({
    where: {
      facilityId: appUser.facilityId,
      ...(q
        ? {
            OR: [
              { binomial: { contains: q, mode: "insensitive" } },
              { commonName: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    take: 20,
    orderBy: [{ commonName: "asc" }, { binomial: "asc" }],
  });

  return NextResponse.json(species);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { binomial, commonName } = body as { binomial?: string; commonName?: string };

  const species = await prisma.species.create({
    data: {
      facilityId: appUser.facilityId,
      binomial: binomial?.trim() || null,
      commonName: commonName?.trim() || null,
    },
  });
  return NextResponse.json(species);
}
