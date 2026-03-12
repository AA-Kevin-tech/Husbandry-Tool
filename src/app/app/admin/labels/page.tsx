import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { LabelsManager } from "./LabelsManager";

export default async function LabelsPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const labels = await prisma.label.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: [{ type: "asc" }, { text: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Labels</h1>
      <LabelsManager initialLabels={labels} />
    </div>
  );
}
