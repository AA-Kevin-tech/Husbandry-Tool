import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { AnimalForm } from "../AnimalForm";

export default async function NewAnimalPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add animal</h1>
      <AnimalForm sections={sections} facilityId={appUser.facilityId} />
    </div>
  );
}
