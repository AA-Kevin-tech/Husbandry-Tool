import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessForm } from "../BusinessForm";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const { id } = await params;
  const business = await prisma.business.findFirst({
    where: { id, facilityId: appUser.facilityId },
  });
  if (!business) notFound();

  const initial = {
    type: business.type,
    name: business.name,
    owner: business.owner,
    contactName: business.contactName,
    contactEmail: business.contactEmail,
    mailingAddress: business.mailingAddress,
    websiteUrl: business.websiteUrl,
    note: business.note,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Edit business</h1>
        <Link
          href="/app/admin/businesses"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to directory
        </Link>
      </div>
      <BusinessForm businessId={id} initial={initial} />
    </div>
  );
}
