import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteOrigin } from "@/lib/store-pricing";
import { EMAIL_PATTERN, cleanString, readJsonObject } from "@/lib/validation";
import { WAIVERS, WAIVER_REVISION, isWaiverId } from "@/lib/waivers";
import {
  createSigningUrl,
  createWaiverEnvelope,
  findSigner,
  getSigners,
  hasSigned,
  isDocusignConfigured,
  templateFor,
} from "@/lib/docusign.server";
import {
  FLOW_COOKIE,
  FLOW_COOKIE_PATH,
  FLOW_TTL_SECONDS,
  clientUserIdFor,
  decodeFlow,
  encodeFlow,
  fingerprintSigners,
  newNonce,
  type WaiverFlow,
} from "@/lib/waiver-session.server";

// Every new envelope uses up paid DocuSign quota: 5 starts per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const EVENT_KEY_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const RETURN_PATH_PATTERN = /^\/[A-Za-z0-9/_-]{0,100}$/;

function validEmail(value: unknown): string | undefined {
  const email = cleanString(value, 254);
  return email && EMAIL_PATTERN.test(email) ? email : undefined;
}

/**
 * Start online signing of a volunteer waiver.
 * POST /api/waiver/start
 *
 * Creates a DocuSign envelope from the waiver's template (or reuses this
 * browser's unfinished one) and returns the embedded signing URL.
 */
export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, "waiver", RATE_LIMIT, RATE_WINDOW_MS);
    if (limited) return limited;

    if (!isDocusignConfigured()) {
      return NextResponse.json(
        { error: "Online signing isn't available right now. Please download the PDF instead." },
        { status: 503 },
      );
    }

    const body = await readJsonObject(request);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const origin = getSiteOrigin(request);

    // Honeypot: real visitors never fill it. Pretend success, create nothing.
    if (typeof body.businessName === "string" && body.businessName.trim() !== "") {
      return NextResponse.json({ url: `${origin}/events` });
    }

    const waiverId = body.waiverId;
    const name = cleanString(body.name, 120);
    const email = validEmail(body.email);
    const minor = body.minor === true;
    const eventKey =
      typeof body.eventKey === "string" && EVENT_KEY_PATTERN.test(body.eventKey)
        ? body.eventKey
        : undefined;
    const returnPath =
      typeof body.returnPath === "string" &&
      RETURN_PATH_PATTERN.test(body.returnPath) &&
      !body.returnPath.includes("//")
        ? body.returnPath
        : "/events";

    if (!isWaiverId(waiverId)) {
      return NextResponse.json({ error: "Unknown waiver" }, { status: 400 });
    }
    if (!name || name.length < 2 || !email) {
      return NextResponse.json(
        { error: "Please provide the volunteer's full name and a valid email." },
        { status: 400 },
      );
    }

    let guardian: { name: string; email: string; signsHere: boolean } | undefined;
    if (minor) {
      const raw = (body.guardian ?? {}) as Record<string, unknown>;
      const guardianName = cleanString(raw.name, 120);
      const guardianEmail = validEmail(raw.email);
      if (!guardianName || guardianName.length < 2 || !guardianEmail) {
        return NextResponse.json(
          { error: "Please provide the guardian's full name and a valid email." },
          { status: 400 },
        );
      }
      guardian = { name: guardianName, email: guardianEmail, signsHere: raw.signsHere !== false };
    }

    const fingerprint = fingerprintSigners([
      waiverId,
      name,
      email,
      minor,
      guardian?.name,
      guardian?.email,
      guardian?.signsHere,
    ]);
    const returnUrl = `${origin}/api/waiver/return`;

    // Reuse this browser's unfinished envelope for the same signer details:
    // a fresh signing link costs nothing, a new envelope uses quota.
    const existing = decodeFlow(request.cookies.get(FLOW_COOKIE)?.value);
    if (existing && existing.fingerprint === fingerprint) {
      const signers = await getSigners(existing.envelopeId).catch(() => null);
      const volunteer = signers && findSigner(signers, "Volunteer");
      const guardianSigner = signers && findSigner(signers, "Guardian");

      if (volunteer && volunteer.status !== "declined" && !hasSigned(volunteer)) {
        const url = await createSigningUrl(
          existing.envelopeId,
          { name, email, clientUserId: clientUserIdFor(existing.nonce, "volunteer") },
          returnUrl,
        );
        return withFlowCookie(NextResponse.json({ url }), { ...existing, eventKey, returnPath });
      }

      if (
        hasSigned(volunteer ?? undefined) &&
        guardian?.signsHere &&
        guardianSigner &&
        guardianSigner.status !== "declined" &&
        !hasSigned(guardianSigner)
      ) {
        const url = await createSigningUrl(
          existing.envelopeId,
          { ...guardian, clientUserId: clientUserIdFor(existing.nonce, "guardian") },
          returnUrl,
        );
        return withFlowCookie(NextResponse.json({ url }), { ...existing, eventKey, returnPath });
      }
    }

    const nonce = newNonce();
    const volunteerClientUserId = clientUserIdFor(nonce, "volunteer");
    const envelopeId = await createWaiverEnvelope({
      templateId: templateFor(waiverId, minor),
      emailSubject: `Please sign: ${WAIVERS[waiverId].title}`,
      volunteer: { name, email, clientUserId: volunteerClientUserId },
      guardian: guardian && {
        name: guardian.name,
        email: guardian.email,
        clientUserId: guardian.signsHere ? clientUserIdFor(nonce, "guardian") : undefined,
      },
      customFields: {
        waiverId,
        waiverRevision: WAIVER_REVISION,
        ...(eventKey ? { eventKey } : {}),
      },
      webhookUrl: `${origin}/api/waiver/webhook`,
    });

    const url = await createSigningUrl(
      envelopeId,
      { name, email, clientUserId: volunteerClientUserId },
      returnUrl,
    );

    return withFlowCookie(NextResponse.json({ url }), {
      envelopeId,
      waiverId,
      eventKey,
      returnPath,
      nonce,
      guardian: guardian ? (guardian.signsHere ? "here" : "email") : undefined,
      fingerprint,
      expiresAt: Math.floor(Date.now() / 1000) + FLOW_TTL_SECONDS,
    });
  } catch (error) {
    // Log the failure only; the request body holds personal details.
    console.error("Waiver start error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "We couldn't start online signing. Please try again or download the PDF." },
      { status: 502 },
    );
  }
}

function withFlowCookie(response: NextResponse, flow: WaiverFlow) {
  response.cookies.set(FLOW_COOKIE, encodeFlow(flow), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: FLOW_COOKIE_PATH,
    maxAge: FLOW_TTL_SECONDS,
  });
  return response;
}
