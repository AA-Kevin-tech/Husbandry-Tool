import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { UsersManager } from "./UsersManager";

export default async function UsersPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const members = await prisma.facilityMember.findMany({
    where: { facilityId: appUser.facilityId },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User management</h1>
      <UsersManager members={members} />
    </div>
  );
}
