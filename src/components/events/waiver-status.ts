import type { WaiverReturnStatus } from "@/lib/waivers";

export type { WaiverReturnStatus };

export const WAIVER_STATUS_MESSAGES: Record<
  WaiverReturnStatus,
  { tone: "success" | "info" | "warning"; text: string }
> = {
  complete: {
    tone: "success",
    text: "Thank you! Your waiver is signed.",
  },
  "guardian-pending": {
    tone: "info",
    text: "Thank you! We've emailed the guardian a link to sign. The waiver is complete once they sign.",
  },
  cancel: {
    tone: "warning",
    text: "Signing was paused before it finished. You can try again anytime or download the PDF instead.",
  },
  decline: {
    tone: "warning",
    text: "The waiver was declined, so it wasn't signed. Reach out to info@thesourceofhope.org with any questions.",
  },
  incomplete: {
    tone: "warning",
    text: "The waiver isn't finished yet. You can try again or download the PDF instead.",
  },
  error: {
    tone: "warning",
    text: "Something went wrong while confirming your signature. Please try again or download the PDF.",
  },
};

export const WAIVER_STATUS_TONES = {
  success: "bg-green-50 text-green-800 border-green-200",
  info: "bg-accent-50 text-accent-800 border-accent-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
};

export function toWaiverReturnStatus(value: string | null): WaiverReturnStatus | null {
  return value && value in WAIVER_STATUS_MESSAGES ? (value as WaiverReturnStatus) : null;
}
