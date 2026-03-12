import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ensureUserAndFacility } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        await ensureUserAndFacility(authUser.id, authUser.email ?? "");
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
