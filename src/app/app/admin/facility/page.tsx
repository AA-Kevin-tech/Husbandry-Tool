import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { FacilityForm } from "./FacilityForm";

export default async function FacilitySetupPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const facility = await prisma.facility.findUnique({
    where: { id: appUser.facilityId },
  });
  if (!facility) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Facility setup</h1>
      <FacilityForm facility={facility} />
    </div>
  );
}
