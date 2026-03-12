import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { ensureUserAndFacility } from "@/lib/auth";

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  facilityId: string;
  facilityName: string;
  role: string;
};

export async function getAppUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  await ensureUserAndFacility(authUser.id, authUser.email ?? "");

  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: {
      facilityMembers: {
        include: { facility: true },
        take: 1,
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!user || user.facilityMembers.length === 0) return null;

  const fm = user.facilityMembers[0];
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    facilityId: fm.facilityId,
    facilityName: fm.facility.name,
    role: fm.role,
  };
}
