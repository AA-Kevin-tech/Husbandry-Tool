import { getAppUser } from "@/lib/auth-server";
import { ChatUI } from "./ChatUI";

export default async function ChatPage() {
  const appUser = await getAppUser();
  if (!appUser) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Team chat</h1>
      <ChatUI facilityId={appUser.facilityId} userId={appUser.id} />
    </div>
  );
}
