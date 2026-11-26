import { NextResponse } from "next/server";
import { SendEmailPayload, staffEmailFor } from "@/lib/auth/send-email-hook";
import { sendEmail } from "@/lib/email/send";
import { requireEnv } from "@/lib/env.server";
import { createLogger } from "@/lib/platform/log";
import { verifyStandardWebhook } from "@/lib/platform/webhooks";

const log = createLogger("auth.send-email-hook");

/** Supabase's hook error shape: it shows `message` in Auth's logs. */
const hookError = (status: number, message: string) => NextResponse.json({ error: { http_code: status, message } }, { status });

/**
 * POST /api/auth/send-email: the Supabase Auth Send Email hook. Verifies the
 * Standard Webhooks signature, then sends the staff email through Resend.
 */
export async function POST(request: Request) {
  const payload = await request.text();
  if (!verifyStandardWebhook({ payload, headers: request.headers, secret: requireEnv("SUPABASE_AUTH_HOOK_SECRET") })) {
    return hookError(401, "invalid signature");
  }

  const parsed = SendEmailPayload.safeParse(JSON.parse(payload));
  if (!parsed.success) return hookError(400, "unexpected payload");

  const email = staffEmailFor(parsed.data, requireEnv("NEXT_PUBLIC_SITE_URL"));
  if (!email) {
    log.warn("ignored action", { action: parsed.data.email_data.email_action_type });
    return NextResponse.json({});
  }

  try {
    await sendEmail({ to: parsed.data.user.email, subject: email.subject, body: email.body, tag: email.tag });
    return NextResponse.json({});
  } catch {
    return hookError(502, "email provider unavailable");
  }
}
