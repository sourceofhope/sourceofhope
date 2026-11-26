import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Keep the staff session fresh (02 §7): runs in the proxy for /staff routes,
 * so Server Components always see a valid session and refreshed cookies are
 * written back. Without Supabase configured (CI, local without the stack),
 * it passes the request through and pages send people to sign-in.
 */
export async function refreshStaffSession(request: NextRequest): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request });
  // The Staff Portal is never indexed, whatever happens below.
  response.headers.set("x-robots-tag", "noindex, nofollow");
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        response.headers.set("x-robots-tag", "noindex, nofollow");
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });
  // Validates and refreshes the token. Don't add logic between client creation and this call.
  await supabase.auth.getUser();
  return response;
}
