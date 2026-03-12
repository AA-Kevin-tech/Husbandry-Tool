import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { MedicalForm } from "../MedicalForm";

export default async function NewMedicalPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const animals = await prisma.animal.findMany({
    where: { facilityId: appUser.facilityId },
    include: {
      section: { select: { name: true } },
      species: { select: { commonName: true, binomial: true } },
    },
    orderBy: { name: "asc" },
  });

  const businesses = await prisma.business.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, type: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add medical record</h1>
      <MedicalForm animals={animals} businesses={businesses} />
    </div>
  );
}
