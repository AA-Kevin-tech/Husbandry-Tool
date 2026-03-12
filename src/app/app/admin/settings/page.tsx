import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { AppSettingsForm } from "./AppSettingsForm";

export default async function AppSettingsPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  const facility = await prisma.facility.findUnique({
    where: { id: appUser.facilityId },
  });
  const settings = (facility?.settings as Record<string, unknown>) ?? {};

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">App settings</h1>
      <AppSettingsForm
        facilityId={appUser.facilityId}
        initial={{
          startOfWeek: (settings.startOfWeek as string) ?? "Monday",
          systemOfMeasurement: (settings.systemOfMeasurement as string) ?? "Metric",
          dateFormat: (settings.dateFormat as string) ?? "MM/DD/YYYY",
          timeFormat: (settings.timeFormat as string) ?? "12h",
        }}
      />
    </div>
  );
}
