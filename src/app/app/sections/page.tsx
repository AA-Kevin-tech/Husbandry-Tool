import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { SectionTree, type SectionWithRelations } from "./SectionTree";

export default async function SectionsPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const sections = await prisma.section.findMany({
    where: { facilityId: appUser.facilityId },
    include: {
      parent: { select: { id: true, name: true } },
      children: { orderBy: { sortOrder: "asc" } },
      members: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
  });

  const rootSections = sections.filter((s) => !s.parentId) as SectionWithRelations[];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Section management</h1>
      <SectionTree
        sections={sections as SectionWithRelations[]}
        rootSections={rootSections}
        facilityId={appUser.facilityId}
      />
    </div>
  );
}
