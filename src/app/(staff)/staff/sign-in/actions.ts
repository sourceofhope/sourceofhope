"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { authClient } from "@/lib/auth/supabase-session";
import { postgresRateLimitStore } from "@/lib/db/platform";
import { requireEnv } from "@/lib/env.server";
import { createLogger } from "@/lib/platform/log";
import { callerIdFrom, checkRateLimit } from "@/lib/platform/rate-limit";

const log = createLogger("staff.sign-in");
const STAFF_SIGN_IN_LIMIT = { name: "staff-sign-in", limit: 5, windowSeconds: 600 };

export type SignInState = { status: "idle" | "sent" | "invalid" | "too_many" };

/**
 * Email a magic link (02 §7). Never creates users: only invited staff can
 * sign in. Always answers "sent" for a valid address, so the form doesn't
 * reveal who has an account.
 */
export async function requestSignInLink(_previous: SignInState, form: FormData): Promise<SignInState> {
  const email = z.email().safeParse(String(form.get("email") ?? "").trim());
  if (!email.success) return { status: "invalid" };

  const limit = await checkRateLimit(postgresRateLimitStore(), STAFF_SIGN_IN_LIMIT, callerIdFrom(await headers()));
  if (!limit.allowed) return { status: "too_many" };

  const auth = await authClient();
  const { error } = await auth.auth.signInWithOtp({
    email: email.data,
    options: { shouldCreateUser: false, emailRedirectTo: new URL("/staff/auth/confirm", requireEnv("NEXT_PUBLIC_SITE_URL")).toString() },
  });
  // "Signups not allowed" means no such staff account: answer the same way.
  if (error && !/signups not allowed|not found/i.test(error.message)) log.error("otp request failed", { error: error.message });
  return { status: "sent" };
}
