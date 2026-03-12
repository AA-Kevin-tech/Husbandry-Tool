import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const section = await prisma.section.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!section)
    return NextResponse.json({ error: "Section not found" }, { status: 404 });

  const body = await request.json();
  const { name, parentId, sortOrder, dailyReportsEnabled, status } = body as {
    name?: string;
    parentId?: string | null;
    sortOrder?: number;
    dailyReportsEnabled?: boolean;
    status?: "Active" | "Inactive";
  };

  const data: Parameters<typeof prisma.section.update>[0]["data"] = {};
  if (typeof name === "string" && name.trim()) data.name = name.trim();
  if (parentId !== undefined) data.parentId = parentId ?? null;
  if (typeof sortOrder === "number") data.sortOrder = sortOrder;
  if (typeof dailyReportsEnabled === "boolean")
    data.dailyReportsEnabled = dailyReportsEnabled;
  if (status === "Active" || status === "Inactive") data.status = status;

  const updated = await prisma.section.update({
    where: { id },
    data,
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
  const section = await prisma.section.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!section)
    return NextResponse.json({ error: "Section not found" }, { status: 404 });

  await prisma.section.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
