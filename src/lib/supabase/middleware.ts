import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const APP_PATHS = ["/app", "/dashboard"];

function isAppPath(pathname: string) {
  return APP_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAppPath(request.nextUrl.pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    const redirect = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((c) =>
      redirect.cookies.set(c.name, c.value, { path: "/" })
    );
    return redirect;
  }

  return supabaseResponse;
}
