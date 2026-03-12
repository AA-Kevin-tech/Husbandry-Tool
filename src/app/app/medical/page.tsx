import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { MedicalList } from "./MedicalList";

export default async function MedicalPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const recordsWithNext = await prisma.medicalRecord.findMany({
    where: { facilityId: appUser.facilityId },
    include: {
      animal: {
        select: {
          id: true,
          name: true,
          section: { select: { id: true, name: true } },
          species: { select: { commonName: true } },
        },
      },
      veterinarian: { select: { id: true, name: true } },
    },
    orderBy: { recordDate: "desc" },
    take: 51,
  });
  const records = recordsWithNext.slice(0, 50);
  const nextCursor = recordsWithNext.length > 50 ? recordsWithNext[49]?.id : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Medical records</h1>
        <Link
          href="/app/medical/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add medical record
        </Link>
      </div>
      <MedicalList
        initialRecords={records}
        sections={sections}
        initialNextCursor={nextCursor}
      />
    </div>
  );
}
