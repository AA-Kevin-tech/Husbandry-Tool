import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { AnimalList } from "./AnimalList";

export default async function AnimalsPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const animals = await prisma.animal.findMany({
    where: { facilityId: appUser.facilityId },
    include: {
      section: { select: { id: true, name: true } },
      species: { select: { id: true, binomial: true, commonName: true } },
    },
    orderBy: [{ section: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Animal inventory</h1>
      <AnimalList
        initialAnimals={animals}
        sections={sections}
        facilityId={appUser.facilityId}
      />
    </div>
  );
}
