import { focusRing, tv, type VariantProps } from "../lib/tv";

/** One link look for internal and external text links (spec §6). */
export const linkStyles = tv({
  base: "inline-flex items-center gap-1 rounded-sm font-semibold underline underline-offset-4 decoration-1 [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    surface: {
      default: ["text-action hover:text-action-hover", focusRing.default],
      inverse: ["text-on-inverse hover:text-on-inverse-muted", focusRing.inverse],
    },
    /** `quiet`: no underline until hover (navigation lists, footers). */
    quiet: { true: "no-underline hover:underline" },
  },
  defaultVariants: { surface: "default" },
});

export type LinkStyleProps = VariantProps<typeof linkStyles>;
