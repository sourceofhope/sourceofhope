import type { ReactElement } from "react";
import { z } from "zod";
import { StaffInviteEmail, StaffSignInEmail } from "@/lib/email/templates/staff";

/**
 * Supabase Auth "Send Email" hook (02 §7, spike 0.6): Supabase calls us
 * instead of sending its own emails, so every staff email goes out through
 * Resend with our layout. Pure parts here; the route handler verifies the
 * signature and sends.
 */

export const SendEmailPayload = z.object({
  user: z.object({ id: z.string(), email: z.email() }),
  email_data: z.object({
    token_hash: z.string().min(1),
    redirect_to: z.string().optional().default(""),
    email_action_type: z.string(),
    site_url: z.string().optional(),
  }),
});
export type SendEmailPayload = z.infer<typeof SendEmailPayload>;

/** The `type` our confirm route passes to verifyOtp, per Supabase action. Others aren't used by staff. */
const OTP_TYPES: Record<string, "invite" | "magiclink" | "email"> = {
  invite: "invite",
  magiclink: "magiclink",
  signup: "email",
};

export type StaffEmail = { subject: string; tag: string; body: ReactElement };

/**
 * Build the email for a hook call, or null for actions staff never trigger
 * (password recovery, email change: staff have no passwords).
 * The link goes to our confirm route on `siteUrl`, never to Supabase.
 */
export function staffEmailFor(payload: SendEmailPayload, siteUrl: string): StaffEmail | null {
  const type = OTP_TYPES[payload.email_data.email_action_type];
  if (!type) return null;
  const url = new URL("/staff/auth/confirm", siteUrl);
  url.searchParams.set("token_hash", payload.email_data.token_hash);
  url.searchParams.set("type", type);
  const link = url.toString();
  return type === "invite"
    ? { subject: "You're invited to the TSOH Staff Portal", tag: "staff-invite", body: StaffInviteEmail({ url: link }) }
    : { subject: "Your Staff Portal sign-in link", tag: "staff-sign-in", body: StaffSignInEmail({ url: link }) };
}
