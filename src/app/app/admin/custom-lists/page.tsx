import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { CustomListsManager } from "./CustomListsManager";

export default async function CustomListsPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const listTypes = await prisma.customListType.findMany({
    where: { facilityId: appUser.facilityId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Custom lists</h1>
      <CustomListsManager initialListTypes={listTypes} />
    </div>
  );
}
