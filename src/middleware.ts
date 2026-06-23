import { NextResponse, type NextRequest } from "next/server";

import { hasSupabasePublicConfig } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Protects the admin area. Unauthenticated visitors are sent to the login
 * page (preserving where they were headed); signed-in admins skip the login
 * page. Runs only on /admin/* via the matcher below.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  // If Supabase isn't configured, keep the app usable: route everything to the
  // login page, which surfaces a clear "not configured" message.
  if (!hasSupabasePublicConfig()) {
    if (isLogin) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { supabaseResponse, user } = await updateSession(request);

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
