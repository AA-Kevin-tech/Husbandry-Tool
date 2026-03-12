import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get("type")?.trim();

  const businesses = await prisma.business.findMany({
    where: {
      facilityId: appUser.facilityId,
      ...(typeFilter ? { type: typeFilter } : {}),
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(businesses);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const {
    type,
    name,
    owner,
    contactName,
    contactEmail,
    mailingAddress,
    physicalAddress,
    websiteUrl,
    note,
  } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || !name.trim())
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );

  const business = await prisma.business.create({
    data: {
      facilityId: appUser.facilityId,
      type: typeof type === "string" ? type : "Other",
      name: name.trim(),
      owner: typeof owner === "string" ? owner : null,
      contactName: typeof contactName === "string" ? contactName : null,
      contactEmail: typeof contactEmail === "string" ? contactEmail : null,
      mailingAddress: typeof mailingAddress === "string" ? mailingAddress : null,
      physicalAddress: typeof physicalAddress === "string" ? physicalAddress : null,
      websiteUrl: typeof websiteUrl === "string" ? websiteUrl : null,
      note: typeof note === "string" ? note : null,
    },
  });
  return NextResponse.json(business);
}
