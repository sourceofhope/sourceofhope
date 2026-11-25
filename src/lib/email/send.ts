import "server-only";
import type { ReactElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { requireEnv } from "@/lib/env.server";
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
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const { html, text } = await renderEmail(body);
  const { data, error } = await resend.emails.send({ from: requireEnv("EMAIL_FROM"), to, subject, html, text, tags: [{ name: "kind", value: tag }] });
  if (error || !data) {
    log.error("send failed", { tag, error: error?.message });
    throw new Error(`Email send failed (${tag})`);
  }
  log.info("sent", { tag, id: data.id });
  return data.id;
}
