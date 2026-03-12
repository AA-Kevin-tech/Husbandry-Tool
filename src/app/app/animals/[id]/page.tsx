import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimalForm } from "../AnimalForm";

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const { id } = await params;
  const animal = await prisma.animal.findFirst({
    where: { id, facilityId: appUser.facilityId },
    include: {
      section: { select: { id: true, name: true } },
      species: { select: { id: true, binomial: true, commonName: true } },
    },
  });
  if (!animal) notFound();

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const initial = {
    sectionId: animal.sectionId,
    speciesId: animal.speciesId,
    name: animal.name,
    disposition: animal.disposition,
    birthDate: animal.birthDate?.toISOString().slice(0, 10),
    birthDateEstimate: animal.birthDateEstimate,
    weight: animal.weight,
    weightUnit: animal.weightUnit,
    gender: animal.gender,
    breedingStatus: animal.breedingStatus,
    note: animal.note,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {animal.name || "Unnamed"} · {animal.section.name}
        </h1>
        <Link
          href="/app/animals"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to inventory
        </Link>
      </div>
      <AnimalForm
        sections={sections}
        facilityId={appUser.facilityId}
        animalId={id}
        initial={initial}
      />
    </div>
  );
}
