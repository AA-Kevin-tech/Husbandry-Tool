import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET() {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const members = await prisma.facilityMember.findMany({
    where: { facilityId: appUser.facilityId },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(members);
}

export async function PATCH(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { userId, role } = body as { userId?: string; role?: string };
  if (!userId)
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  const validRoles = ["Admin", "Staff", "Viewer"];
  if (!role || !validRoles.includes(role))
    return NextResponse.json(
      { error: "role must be one of: " + validRoles.join(", ") },
      { status: 400 }
    );

  const member = await prisma.facilityMember.findFirst({
    where: { facilityId: appUser.facilityId, userId },
  });
  if (!member)
    return NextResponse.json({ error: "User not found in facility" }, { status: 404 });

  const updated = await prisma.facilityMember.update({
    where: { id: member.id },
    data: { role: role as "Admin" | "Staff" | "Viewer" },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
  return NextResponse.json(updated);
}
