import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sectionId } = await params;
  const section = await prisma.section.findFirst({
    where: { id: sectionId, facilityId: appUser.facilityId },
  });
  if (!section)
    return NextResponse.json({ error: "Section not found" }, { status: 404 });

  const body = await request.json();
  const { userId, designation } = body as {
    userId?: string;
    designation?: string;
  };
  if (!userId)
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );

  const member = await prisma.facilityMember.findFirst({
    where: { facilityId: appUser.facilityId, userId },
  });
  if (!member)
    return NextResponse.json(
      { error: "User is not a member of this facility" },
      { status: 400 }
    );

  await prisma.sectionMember.upsert({
    where: {
      sectionId_userId: { sectionId, userId },
    },
    create: { sectionId, userId, designation: designation ?? null },
    update: { designation: designation ?? undefined },
  });

  const updated = await prisma.sectionMember.findFirst({
    where: { sectionId, userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sectionId } = await params;
  const section = await prisma.section.findFirst({
    where: { id: sectionId, facilityId: appUser.facilityId },
  });
  if (!section)
    return NextResponse.json({ error: "Section not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json(
      { error: "userId query required" },
      { status: 400 }
    );

  await prisma.sectionMember.deleteMany({
    where: { sectionId, userId },
  });
  return new NextResponse(null, { status: 204 });
}
