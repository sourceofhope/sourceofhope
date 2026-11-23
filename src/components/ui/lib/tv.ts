/**
 * The one variant helper for every primitive (ADR-0009 §3). Components import
 * `tv` from here, never from tailwind-variants directly, so class merging
 * always knows our custom token names.
 */
import { createTV } from "tailwind-variants/config";

export const tv = createTV({
  twMergeConfig: {
    extend: {
      theme: {
        // Custom theme keys that must merge with Tailwind's built-ins in the
        // same group (e.g. a `shadow-overlay` override replaces `shadow-raised`).
        shadow: ["raised", "overlay"],
        container: ["page", "prose"],
        spacing: ["section-sm", "section", "section-lg"],
      },
    },
  },
});

export type { VariantProps } from "tailwind-variants";

/**
 * Shared focus ring (ADR-0009 §3): one look for every focusable element.
 * `inverse` is for controls sitting on the hero video or the footer.
 */
export const focusRing = {
  default:
    "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  inverse:
    "outline-none focus-visible:ring-2 focus-visible:ring-focus-inverse focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
} as const;
