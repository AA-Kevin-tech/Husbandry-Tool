import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MedicalForm } from "../MedicalForm";

export default async function MedicalRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const { id } = await params;
  const record = await prisma.medicalRecord.findFirst({
    where: { id, facilityId: appUser.facilityId },
    include: {
      animal: {
        include: {
          section: { select: { name: true } },
          species: { select: { commonName: true, binomial: true } },
        },
      },
      veterinarian: true,
      drugs: true,
      vaccines: true,
    },
  });
  if (!record) notFound();

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

  const initial = {
    animalId: record.animalId,
    veterinarianId: record.veterinarianId,
    vetVisit: record.vetVisit,
    routineVaccination: record.routineVaccination,
    recordDate: record.recordDate.toISOString().slice(0, 10),
    weight: record.weight,
    problemDescription: record.problemDescription,
    diagnosis: record.diagnosis,
    treatmentDescription: record.treatmentDescription,
    note: record.note,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Medical record · {record.animal.name || "Unnamed"} ·{" "}
          {new Date(record.recordDate).toLocaleDateString()}
        </h1>
        <Link
          href="/app/medical"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to medical records
        </Link>
      </div>
      <MedicalForm
        animals={animals}
        businesses={businesses}
        recordId={id}
        initial={initial}
      />
      {(record.drugs?.length > 0 || record.vaccines?.length > 0) && (
        <div className="mt-6 pt-6 border-t">
          <h2 className="font-medium mb-2">Drugs</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {record.drugs?.map((d) => (
              <li key={d.id}>
                {d.drug} {d.dosage && `· ${d.dosage}`} {d.frequency && `· ${d.frequency}`}
              </li>
            ))}
          </ul>
          <h2 className="font-medium mb-2 mt-4">Vaccines</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {record.vaccines?.map((v) => (
              <li key={v.id}>{v.vaccine}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
