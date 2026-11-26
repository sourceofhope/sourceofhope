"use server";

import { z } from "zod";
import { requireStaffPage } from "@/lib/auth/guard";
import { authClient } from "@/lib/auth/supabase-session";

export type SecurityState =
  | { status: "idle" }
  | { status: "enrolling"; factorId: string; qrCode: string; secret: string }
  | { status: "verified" }
  | { status: "wrong_code"; factorId: string; qrCode?: string; secret?: string };

/** Start TOTP setup: returns the QR code and key for the authenticator app. */
export async function startEnrollment(): Promise<SecurityState> {
  await requireStaffPage();
  const auth = await authClient();
  // Drop any half-finished setup so the person can start over cleanly.
  const { data: factors } = await auth.auth.mfa.listFactors();
  for (const factor of factors?.all ?? []) {
    if (factor.factor_type === "totp" && factor.status === "unverified") await auth.auth.mfa.unenroll({ factorId: factor.id });
  }
  const { data, error } = await auth.auth.mfa.enroll({ factorType: "totp", friendlyName: "Authenticator app" });
  if (error || !data) throw new Error("Couldn't start two-step setup");
  return { status: "enrolling", factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
}

/**
 * Verify a 6-digit code: finishes setup, or raises an existing session to
 * aal2. Either way the session can now use second-factor permissions.
 */
export async function verifyCode(previous: SecurityState, form: FormData): Promise<SecurityState> {
  await requireStaffPage();
  const code = z.string().regex(/^\d{6}$/).safeParse(String(form.get("code") ?? "").replace(/\s/g, ""));
  const factorId = String(form.get("factorId") ?? "");
  const keep = previous.status === "enrolling" || previous.status === "wrong_code" ? { qrCode: previous.qrCode, secret: previous.secret } : {};
  if (!code.success || !factorId) return { status: "wrong_code", factorId, ...keep };
  const auth = await authClient();
  const { error } = await auth.auth.mfa.challengeAndVerify({ factorId, code: code.data });
  return error ? { status: "wrong_code", factorId, ...keep } : { status: "verified" };
}
