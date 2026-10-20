import { ASSET_VERSION } from "@/lib/environment";

/**
 * Volunteer waivers. Safe to import from server and client components.
 *
 * Each waiver applies to every activity from the day it is signed until the
 * volunteer revokes it in writing, so volunteers only need to sign once per
 * revision. Bump `WAIVER_REVISION` whenever the PDFs (and the matching
 * DocuSign templates) change, so returning volunteers are asked to sign again.
 */
export const WAIVER_REVISION = "2026-09";

export const WAIVER_IDS = ["general", "serving-hope"] as const;

export type WaiverId = (typeof WAIVER_IDS)[number];

/** Outcomes /api/waiver/return reports back to the page through `?waiver=`. */
export type WaiverReturnStatus =
  | "complete"
  | "guardian-pending"
  | "cancel"
  | "decline"
  | "incomplete"
  | "error";

/** Which waiver an event needs, as stored in Sanity. */
export type EventWaiver = WaiverId | "none";

export interface Waiver {
  id: WaiverId;
  title: string;
  shortTitle: string;
  description: string;
  /** Static PDF for people who prefer to print, sign, and bring it. */
  href: string;
}

export const WAIVERS: Record<WaiverId, Waiver> = {
  general: {
    id: "general",
    title: "General Volunteer Agreement",
    shortTitle: "General Volunteer Agreement",
    description:
      "Covers all Source of Hope programs, events, and partner locations.",
    href: `/${ASSET_VERSION}/documents/TSOH-Volunteer-Agreement.pdf`,
  },
  "serving-hope": {
    id: "serving-hope",
    title: "Serving Hope Volunteer Agreement",
    shortTitle: "Serving Hope Agreement",
    description:
      "Required for volunteers serving meals with Serving Hope at Cornerstone Kitchen.",
    href: `/${ASSET_VERSION}/documents/TSOH-Serving-Hope-Volunteer-Agreement.pdf`,
  },
};

export function isWaiverId(value: unknown): value is WaiverId {
  return typeof value === "string" && (WAIVER_IDS as readonly string[]).includes(value);
}

/**
 * Browser-readable cookie that remembers which waivers were signed online on
 * this device, e.g. `general:2026-09|serving-hope:2026-09`. It only drives
 * the soft "signed on this device" message, so it holds no personal data and
 * needs no signature.
 */
export const SIGNED_WAIVERS_COOKIE = "tsoh_waivers";

export function parseSignedWaivers(cookieValue: string | undefined): WaiverId[] {
  if (!cookieValue) return [];
  return cookieValue
    .split("|")
    .map((entry) => entry.split(":"))
    .filter(([id, revision]) => isWaiverId(id) && revision === WAIVER_REVISION)
    .map(([id]) => id as WaiverId);
}

export function serializeSignedWaivers(ids: WaiverId[]): string {
  return [...new Set(ids)].map((id) => `${id}:${WAIVER_REVISION}`).join("|");
}
