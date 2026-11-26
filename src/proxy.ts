import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { refreshStaffSession } from "./lib/auth/proxy-session";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * Public pages get locale routing (ADR-0004). The Staff Portal is English
 * only and outside [locale]; there the proxy refreshes the staff session.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/staff" || pathname.startsWith("/staff/")) return refreshStaffSession(request);
  return intl(request);
}

export const config = {
  // Everything except: API routes, the other unlocalized areas (/link,
  // /styleguide) as whole segments, Next/Vercel internals, and files.
  matcher: "/((?!(?:api|link|styleguide)(?:/|$)|_next|_vercel|.*\\..*).*)",
};
