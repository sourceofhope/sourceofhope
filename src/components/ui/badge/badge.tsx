import type { ComponentProps } from "react";
import { tv, type VariantProps } from "../lib/tv";

export const badgeStyles = tv({
  base: "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold",
  variants: {
    tone: {
      public: "bg-tone-public text-tone-public-ink",
      volunteer: "bg-tone-volunteer text-tone-volunteer-ink",
      neutral: "bg-tone-neutral text-tone-neutral-ink",
      danger: "bg-tone-danger text-tone-danger-ink",
      success: "bg-success-subtle text-success",
      warning: "bg-warning-subtle text-warning",
      info: "bg-info-subtle text-info",
    },
  },
  defaultVariants: { tone: "neutral" },
});

/**
 * Badge: a short status word ("Open to the public", "Full"). Color is never
 * the only signal; the word carries the meaning (spec §5.1).
 */
export function Badge({ tone, className, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeStyles>) {
  return <span {...props} className={badgeStyles({ tone, class: className })} />;
}
