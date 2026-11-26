import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { authClient } from "@/lib/auth/supabase-session";
import { db } from "@/lib/db/client";

const ALLOWED: readonly EmailOtpType[] = ["magiclink", "invite", "email"];

/**
 * GET /staff/auth/confirm?token_hash=…&type=…: the link in staff emails.
 * Exchanges the one-time token for a session cookie, then sends the person
 * to the overview. Any failure goes back to sign-in with a plain message.
 */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const failed = NextResponse.redirect(new URL("/staff/sign-in?error=link", request.url));
  if (!tokenHash || !type || !ALLOWED.includes(type)) return failed;

  let auth: Awaited<ReturnType<typeof authClient>>;
  try {
    auth = await authClient();
  } catch {
    return failed; // Supabase isn't configured here (CI, or a local build without the stack).
  }
  const { data, error } = await auth.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error || !data.user) return failed;

  // Only active staff get in; anyone else is signed straight back out.
  const { data: staff } = await db().from("staff_users").select("id, active").eq("auth_user_id", data.user.id).maybeSingle();
  if (!staff?.active) {
    await auth.auth.signOut();
    return failed;
  }
  await db().from("staff_users").update({ last_sign_in_at: new Date().toISOString() }).eq("id", staff.id);
  return NextResponse.redirect(new URL("/staff", request.url));
}
