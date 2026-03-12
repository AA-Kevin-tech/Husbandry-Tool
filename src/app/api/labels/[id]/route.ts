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
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const label = await prisma.label.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!label)
    return NextResponse.json({ error: "Label not found" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.text !== undefined) data.text = body.text;
  if (body.color !== undefined) data.color = body.color;

  const updated = await prisma.label.update({
    where: { id },
    data: data as Parameters<typeof prisma.label.update>[0]["data"],
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
  const label = await prisma.label.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!label)
    return NextResponse.json({ error: "Label not found" }, { status: 404 });

  await prisma.label.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
