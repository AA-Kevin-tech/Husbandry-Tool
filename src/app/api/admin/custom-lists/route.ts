import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET() {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const listTypes = await prisma.customListType.findMany({
    where: { facilityId: appUser.facilityId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(listTypes);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { slug, name } = body as { slug?: string; name?: string };
  if (!slug || !name)
    return NextResponse.json(
      { error: "slug and name are required" },
      { status: 400 }
    );

  const listType = await prisma.customListType.create({
    data: {
      facilityId: appUser.facilityId,
      slug: String(slug).trim().toLowerCase().replace(/\s+/g, "_"),
      name: String(name).trim(),
    },
    include: { items: true },
  });
  return NextResponse.json(listType);
}
