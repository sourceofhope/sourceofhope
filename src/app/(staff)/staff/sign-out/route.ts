import { NextResponse, type NextRequest } from "next/server";
import { authClient } from "@/lib/auth/supabase-session";

/** POST /staff/sign-out: ends the session on this device. */
export async function POST(request: NextRequest) {
  const auth = await authClient();
  await auth.auth.signOut({ scope: "local" });
  return NextResponse.redirect(new URL("/staff/sign-in", request.url), { status: 303 });
}
