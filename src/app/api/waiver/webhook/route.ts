import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getEnvironment } from "@/lib/environment.server";
import { escapeHtml } from "@/lib/validation";
import { WAIVERS, isWaiverId } from "@/lib/waivers";
import { formatLongDate, formatTimeRange } from "@/lib/format-date";
import {
  findSigner,
  getEnvelopeSummary,
  isDocusignConfigured,
} from "@/lib/docusign.server";

export const runtime = "nodejs";

const ENVELOPE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STAFF_EMAIL = "info@thesourceofhope.org";

/** True if any X-DocuSign-Signature-N header matches the HMAC of the raw body. */
function hasValidSignature(request: Request, rawBody: Buffer, key: string): boolean {
  const expected = Buffer.from(createHmac("sha256", key).update(rawBody).digest("base64"));

  for (let index = 1; index <= 100; index++) {
    const header = request.headers.get(`x-docusign-signature-${index}`);
    if (!header) break;
    const provided = Buffer.from(header.trim());
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) return true;
  }
  return false;
}

/**
 * DocuSign Connect notification for completed waivers.
 * POST /api/waiver/webhook
 *
 * Registered per envelope by /api/waiver/start. Verifies the HMAC signature,
 * then emails staff that a volunteer waiver was signed. Deliveries can repeat,
 * so the email uses an idempotency key per envelope.
 */
export async function POST(request: Request) {
  const { docusignHmacKey, resendKey } = getEnvironment();
  if (!docusignHmacKey) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
  }

  const rawBody = Buffer.from(await request.arrayBuffer());
  if (!hasValidSignature(request, rawBody, docusignHmacKey)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: { event?: unknown; data?: { envelopeId?: unknown } };
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const envelopeId = payload.data?.envelopeId;
  if (payload.event !== "envelope-completed" || typeof envelopeId !== "string") {
    return NextResponse.json({ received: true });
  }
  if (!ENVELOPE_ID_PATTERN.test(envelopeId) || !isDocusignConfigured()) {
    return NextResponse.json({ received: true });
  }
  if (!resendKey) {
    console.warn("RESEND_API_KEY not configured; skipping waiver notification", envelopeId);
    return NextResponse.json({ received: true });
  }

  try {
    // Read details from DocuSign rather than trusting the payload's contents.
    const envelope = await getEnvelopeSummary(envelopeId);
    if (envelope.status !== "completed") {
      return NextResponse.json({ received: true });
    }

    const waiverId = envelope.customFields.waiverId;
    const waiverTitle = isWaiverId(waiverId) ? WAIVERS[waiverId].title : "Volunteer waiver";
    const volunteer = findSigner(envelope.signers, "Volunteer");
    const guardian = findSigner(envelope.signers, "Guardian");
    const completed = envelope.completedDateTime
      ? `${formatLongDate(envelope.completedDateTime)}, ${formatTimeRange(envelope.completedDateTime)} Central`
      : "Just now";

    const lines: [string, string][] = [
      ["Waiver", waiverTitle],
      ["Volunteer", volunteer?.name ?? "Unknown"],
      ["Volunteer email", volunteer?.email ?? "Unknown"],
      ...(guardian ? ([["Parent or guardian", guardian.name]] as [string, string][]) : []),
      ["Completed", completed],
      ["Revision", envelope.customFields.waiverRevision ?? "Unknown"],
      ["DocuSign envelope", envelopeId],
    ];

    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send(
      {
        from: "The Source of Hope <onboarding@resend.dev>",
        to: [STAFF_EMAIL],
        subject: `Volunteer waiver signed: ${(volunteer?.name ?? waiverTitle).replace(/[\r\n]+/g, " ")}`,
        text: [
          "A volunteer waiver was signed online. The signed copy is stored in DocuSign.",
          "",
          ...lines.map(([label, value]) => `${label}: ${value}`),
        ].join("\n"),
        html: `
          <h2>Volunteer waiver signed</h2>
          <p>A volunteer waiver was signed online. The signed copy is stored in DocuSign.</p>
          ${lines
            .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
            .join("")}
        `,
      },
      { idempotencyKey: `envelope-completed/${envelopeId}` },
    );

    if (error) {
      console.error("Waiver webhook email error:", error);
      // Ask DocuSign to retry; the idempotency key prevents duplicate emails.
      return NextResponse.json({ error: "Failed to notify staff." }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Waiver webhook error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to process webhook." }, { status: 500 });
  }
}
