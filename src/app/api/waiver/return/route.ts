import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteOrigin } from "@/lib/store-pricing";
import {
  SIGNED_WAIVERS_COOKIE,
  parseSignedWaivers,
  serializeSignedWaivers,
  type WaiverReturnStatus,
} from "@/lib/waivers";
import {
  createSigningUrl,
  findSigner,
  getSigners,
  hasSigned,
} from "@/lib/docusign.server";
import {
  FLOW_COOKIE,
  FLOW_COOKIE_PATH,
  clientUserIdFor,
  decodeFlow,
  type WaiverFlow,
} from "@/lib/waiver-session.server";

// DocuSign appends ?event= when it redirects back. It is only a hint (anyone
// can craft it), so completion is always confirmed with the DocuSign API.
const PAUSED_EVENTS = new Set(["cancel", "session_timeout", "ttl_expired", "viewing_complete"]);

/**
 * Where DocuSign sends signers after the signing ceremony.
 * GET /api/waiver/return
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, "waiver-return", 30, 10 * 60 * 1000);
  if (limited) return limited;

  const origin = getSiteOrigin(request);
  const flow = decodeFlow(request.cookies.get(FLOW_COOKIE)?.value);

  if (!flow) {
    return redirect(origin, null, "error", { clearFlow: true });
  }

  try {
    const signers = await getSigners(flow.envelopeId);
    const volunteer = findSigner(signers, "Volunteer");
    const guardian = findSigner(signers, "Guardian");

    if (volunteer?.status === "declined" || guardian?.status === "declined") {
      return redirect(origin, flow, "decline", { clearFlow: true });
    }

    if (!hasSigned(volunteer)) {
      const hint = request.nextUrl.searchParams.get("event") ?? "";
      return redirect(origin, flow, PAUSED_EVENTS.has(hint) ? "cancel" : "incomplete");
    }

    if (guardian && !hasSigned(guardian)) {
      if (flow.guardian === "email") {
        return redirect(origin, flow, "guardian-pending", { clearFlow: true });
      }

      // Same device: hand the session to the guardian right away.
      try {
        const url = await createSigningUrl(
          flow.envelopeId,
          {
            name: guardian.name,
            email: guardian.email,
            clientUserId: clientUserIdFor(flow.nonce, "guardian"),
          },
          `${origin}/api/waiver/return`,
        );
        return NextResponse.redirect(url, 303);
      } catch (error) {
        // DocuSign can briefly report the guardian as "not in sequence" right
        // after the volunteer signs; "Sign online" again resumes the session.
        console.error("Waiver guardian view error:", error instanceof Error ? error.message : error);
        return redirect(origin, flow, "incomplete");
      }
    }

    const signed = parseSignedWaivers(request.cookies.get(SIGNED_WAIVERS_COOKIE)?.value);
    return redirect(origin, flow, "complete", {
      clearFlow: true,
      signedWaivers: serializeSignedWaivers([...signed, flow.waiverId]),
    });
  } catch (error) {
    console.error("Waiver return error:", error instanceof Error ? error.message : error);
    return redirect(origin, flow, "error");
  }
}

function redirect(
  origin: string,
  flow: WaiverFlow | null,
  status: WaiverReturnStatus,
  options: { clearFlow?: boolean; signedWaivers?: string } = {},
) {
  const url = new URL(flow?.returnPath ?? "/events", origin);
  if (flow?.eventKey) url.searchParams.set("event", flow.eventKey);
  url.searchParams.set("waiver", status);
  if (!flow?.eventKey) url.hash = "volunteer-agreements";

  const response = NextResponse.redirect(url, 303);

  if (options.clearFlow) {
    response.cookies.set(FLOW_COOKIE, "", { path: FLOW_COOKIE_PATH, maxAge: 0 });
  }

  if (options.signedWaivers) {
    // Readable by the page so it can say "signed on this device"; holds no
    // personal data.
    response.cookies.set(SIGNED_WAIVERS_COOKIE, options.signedWaivers, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });
  }

  return response;
}
