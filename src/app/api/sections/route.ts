import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { getAppUser } from "@/lib/auth-server";

export async function GET() {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    include: {
      parent: { select: { id: true, name: true } },
      children: { orderBy: { sortOrder: "asc" } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json(sections);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, parentId, dailyReportsEnabled, status } = body as {
    name?: string;
    parentId?: string | null;
    dailyReportsEnabled?: boolean;
    status?: "Active" | "Inactive";
  };

  if (!name || typeof name !== "string" || !name.trim())
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );

  if (parentId) {
    const parent = await prisma.section.findFirst({
      where: { id: parentId, facilityId: appUser.facilityId },
    });
    if (!parent)
      return NextResponse.json(
        { error: "Parent section not found" },
        { status: 400 }
      );
  }

  const maxOrder = await prisma.section.aggregate({
    where: {
      facilityId: appUser.facilityId,
      parentId: parentId ?? null,
    },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  const section = await prisma.section.create({
    data: {
      facilityId: appUser.facilityId,
      parentId: parentId ?? null,
      name: name.trim(),
      sortOrder,
      dailyReportsEnabled: !!dailyReportsEnabled,
      status: status === "Inactive" ? "Inactive" : "Active",
    },
  });

  return NextResponse.json(section);
}
