import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET() {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let teams = await prisma.team.findMany({
    where: { facilityId: appUser.facilityId },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (teams.length === 0) {
    const team = await prisma.team.create({
      data: {
        facilityId: appUser.facilityId,
        name: "General",
        slug: "general",
      },
    });
    await prisma.teamMember.create({
      data: { teamId: team.id, userId: appUser.id },
    });
    teams = await prisma.team.findMany({
      where: { facilityId: appUser.facilityId },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  return NextResponse.json(teams);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name } = body as { name?: string };
  if (!name || typeof name !== "string" || !name.trim())
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const existing = await prisma.team.findFirst({
    where: { facilityId: appUser.facilityId, slug: slug || "team" },
  });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug || "team";

  const team = await prisma.team.create({
    data: {
      facilityId: appUser.facilityId,
      name: name.trim(),
      slug: finalSlug,
    },
  });
  await prisma.teamMember.create({
    data: { teamId: team.id, userId: appUser.id },
  });

  return NextResponse.json(team);
}
