import { prisma } from "@/lib/db";

export async function ensureUserAndFacility(authId: string, email: string) {
  let user = await prisma.user.findUnique({ where: { authId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        authId,
        email,
        name: email.split("@")[0],
      },
    });
    const facility = await prisma.facility.create({
      data: { name: `${user.name ?? "My"}'s Facility` },
    });
    await prisma.facilityMember.create({
      data: {
        facilityId: facility.id,
        userId: user.id,
        role: "Admin",
      },
    });
    const team = await prisma.team.create({
      data: {
        facilityId: facility.id,
        name: "General",
        slug: "general",
      },
    });
    await prisma.teamMember.create({
      data: { teamId: team.id, userId: user.id },
    });
  }
  return user;
}
