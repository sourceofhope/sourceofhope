import "server-only";
import type { ReactElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { env, requireEnv } from "@/lib/env.server";
import { createLogger } from "@/lib/platform/log";

const log = createLogger("email");

export type OutgoingEmail = {
  to: string;
  subject: string;
  body: ReactElement;
  /** Groups emails in Resend's dashboard (no personal data): "staff-sign-in", "volunteer-complete", … */
  tag: string;
};

/** Render an email to HTML and plain text. */
export async function renderEmail(body: ReactElement) {
  const [html, text] = await Promise.all([render(body), render(body, { plainText: true })]);
  return { html, text };
}

/**
 * Send one email through Resend (02 §6). Returns Resend's id. Logs the tag
 * and outcome only; never the address or content.
 */
export async function sendEmail({ to, subject, body, tag }: OutgoingEmail): Promise<string> {
  const { html, text } = await renderEmail(body);
  const { RESEND_API_KEY, MAILPIT_URL } = env();
  if (!RESEND_API_KEY && MAILPIT_URL && process.env.NODE_ENV !== "production") return sendToMailpit(MAILPIT_URL, { to, subject, html, text, tag });

  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const { data, error } = await resend.emails.send({ from: requireEnv("EMAIL_FROM"), to, subject, html, text, tags: [{ name: "kind", value: tag }] });
  if (error || !data) {
    log.error("send failed", { tag, error: error?.message });
    throw new Error(`Email send failed (${tag})`);
  }
  log.info("sent", { tag, id: data.id });
  return data.id;
}

/**
 * Development only: deliver to the local Mailpit inbox the Supabase CLI runs
 * (http://127.0.0.1:54324), so sign-in and volunteer links can be tested
 * without a Resend account. Never used in production builds.
 */
async function sendToMailpit(base: string, mail: { to: string; subject: string; html: string; text: string; tag: string }): Promise<string> {
  const response = await fetch(new URL("/api/v1/send", base), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      From: { Email: env().EMAIL_FROM?.match(/<(.+)>/)?.[1] ?? "no-reply@localhost", Name: "The Source of Hope" },
      To: [{ Email: mail.to }],
      Subject: mail.subject,
      HTML: mail.html,
      Text: mail.text,
      Tags: [mail.tag],
    }),
  });
  if (!response.ok) throw new Error(`Mailpit send failed (${response.status})`);
  const { ID } = (await response.json()) as { ID: string };
  log.info("sent to mailpit", { tag: mail.tag });
  return ID;
}
