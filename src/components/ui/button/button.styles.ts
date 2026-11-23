import { focusRing, tv, type VariantProps } from "../lib/tv";

/**
 * One recipe for every button-shaped control: Button, LinkButton, IconButton
 * (and HubButton in Phase 4). Spec §6; vocabulary per ADR-0009 §4.
 */
export const buttonStyles = tv({
  base: [
    "inline-flex items-center justify-center gap-2 rounded-md text-center font-semibold",
    "transition-colors duration-(--duration-fast) ease-standard motion-reduce:transition-none",
    "disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      primary: "bg-action text-on-inverse hover:bg-action-hover",
      secondary: "border-2 border-action bg-surface text-action hover:bg-surface-muted",
      tertiary: "bg-transparent text-ink hover:bg-surface-muted",
      danger: "bg-danger text-on-inverse hover:bg-tone-danger-ink",
    },
    size: {
      sm: "min-h-9 px-3 text-sm",
      md: "min-h-11 px-5 text-base",
      lg: "min-h-13 px-7 text-lg",
    },
    surface: {
      default: focusRing.default,
      inverse: focusRing.inverse,
    },
    fullWidth: { true: "w-full" },
    iconOnly: { true: "px-0" },
  },
  compoundVariants: [
    // On the hero video or the footer: outline and text buttons turn white.
    { surface: "inverse", variant: "secondary", class: "border-on-inverse bg-transparent text-on-inverse hover:bg-on-inverse/10" },
    { surface: "inverse", variant: "tertiary", class: "text-on-inverse underline underline-offset-4 hover:bg-on-inverse/10" },
    { iconOnly: true, size: "sm", class: "size-9" },
    { iconOnly: true, size: "md", class: "size-11" },
    { iconOnly: true, size: "lg", class: "size-13" },
  ],
  defaultVariants: { variant: "primary", size: "md", surface: "default" },
});

export type ButtonStyleProps = Omit<VariantProps<typeof buttonStyles>, "iconOnly">;
