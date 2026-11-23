import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except: API routes, unlocalized areas (/staff, /link,
  // /styleguide) as whole segments, Next/Vercel internals, and files.
  matcher: "/((?!(?:api|staff|link|styleguide)(?:/|$)|_next|_vercel|.*\\..*).*)",
};
