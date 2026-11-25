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

/**
 * Navigation links (header, menus). No underline at rest; the current page
 * gets a solid underline from `aria-current="page"` (spec §8.2).
 */
export const navLinkStyles = tv({
  base: [
    "inline-flex min-h-11 items-center gap-1 border-b-2 border-transparent px-1 font-semibold",
    "transition-colors duration-(--duration-fast) motion-reduce:transition-none aria-[current=page]:border-current",
  ],
  variants: {
    surface: {
      default: ["text-ink hover:text-action", focusRing.default],
      inverse: ["text-on-inverse hover:text-on-inverse-muted", focusRing.inverse],
    },
    /** `lg`: a full-width row in the phone menu sheet. */
    size: { md: "", lg: "min-h-12 px-0 text-lg" },
  },
  defaultVariants: { surface: "default", size: "md" },
});

/** Icon-only links (social profiles): a 44px target around a 20px icon. */
export const iconLinkStyles = tv({
  base: "inline-grid size-11 place-items-center rounded-md transition-colors duration-(--duration-fast) motion-reduce:transition-none [&_svg]:size-5",
  variants: {
    surface: {
      default: ["text-ink hover:bg-surface-muted hover:text-action", focusRing.default],
      inverse: ["text-on-inverse hover:bg-on-inverse/10", focusRing.inverse],
    },
  },
  defaultVariants: { surface: "default" },
});
