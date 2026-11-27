"use server";

import { headers } from "next/headers";
import { ORGANIZATION } from "@/content/organization";
import { isDatabaseConfigured } from "@/lib/db/client";
import { postgresRateLimitStore } from "@/lib/db/platform";
import { sendEmail } from "@/lib/email/send";
import { ContactNotificationEmail } from "@/lib/email/templates/contact";
import { env } from "@/lib/env.server";
import { createLogger } from "@/lib/platform/log";
import { callerIdFrom, checkRateLimit, RATE_LIMITS } from "@/lib/platform/rate-limit";
import { contactSchema, type ContactInput, type ContactResult, type ContactValues } from "./schema";

const log = createLogger("contact");

const TOPIC_LABELS: Record<ContactValues["topic"], string> = {
  general: "General question",
  help: "Getting help",
  volunteer: "Volunteering",
  giving: "Giving or sponsorship",
  media: "Media or partnerships",
  other: "Something else",
};

/**
 * Send a contact-form message to TSOH (slice 3.5): validate on the server,
 * drop honeypot submissions silently, rate-limit per connection, then email
 * staff with reply-to set to the sender. Nothing is stored.
 */
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<keyof ContactValues, string>> = {};
    for (const issue of parsed.error.issues) fields[issue.path[0] as keyof ContactValues] ??= issue.message;
    // A filled honeypot is a bot: answer as if it worked.
    if (fields.company) return { status: "sent" };
    return { status: "invalid", fields };
  }

  if (isDatabaseConfigured()) {
    const limit = await checkRateLimit(postgresRateLimitStore(), RATE_LIMITS.contactForm, callerIdFrom(await headers()));
    if (!limit.allowed) return { status: "too_many" };
  }

  const { name, email, phone, topic, message } = parsed.data;
  try {
    await sendEmail({
      to: env().STAFF_EMAIL_INQUIRIES ?? ORGANIZATION.email.display,
      subject: `Website message: ${TOPIC_LABELS[topic]}`,
      replyTo: email,
      tag: "contact-form",
      body: ContactNotificationEmail({ name, email, phone: phone || null, topic: TOPIC_LABELS[topic], message }),
    });
    return { status: "sent" };
  } catch (error) {
    log.error("contact send failed", { error });
    return { status: "failed" };
  }
}
