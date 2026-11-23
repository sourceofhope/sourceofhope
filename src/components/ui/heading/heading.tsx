import type { ComponentProps } from "react";
import { tv, type VariantProps } from "../lib/tv";

const headingStyles = tv({
  base: "font-heading font-bold text-balance",
  variants: {
    size: {
      "5xl": "text-5xl",
      "4xl": "text-4xl",
      "3xl": "text-3xl",
      "2xl": "text-2xl",
      xl: "text-xl",
    },
    surface: { default: "text-ink", inverse: "text-on-inverse" },
  },
  defaultVariants: { surface: "default" },
});

const DEFAULT_SIZE = { 1: "4xl", 2: "3xl", 3: "2xl", 4: "xl" } as const;

export type HeadingProps = Omit<ComponentProps<"h2">, "color"> &
  Omit<VariantProps<typeof headingStyles>, "size"> & {
    /** The semantic level (one h1 per page, spec §12). Required. */
    level: 1 | 2 | 3 | 4;
    /** Visual size, independent of level. Defaults by level. */
    size?: keyof typeof headingStyles.variants.size;
  };

/** Heading: semantic level and visual size are separate (spec §5.2). */
export function Heading({ level, size, surface, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag {...props} className={headingStyles({ size: size ?? DEFAULT_SIZE[level], surface, class: className })} />;
}

const eyebrowStyles = tv({
  base: "text-xs font-semibold uppercase tracking-wide",
  variants: { surface: { default: "text-info", inverse: "text-on-inverse" } },
  defaultVariants: { surface: "default" },
});

/** Eyebrow: the small uppercase line above a heading. Not a heading itself. */
export function Eyebrow({
  surface,
  className,
  ...props
}: ComponentProps<"p"> & VariantProps<typeof eyebrowStyles>) {
  return <p {...props} className={eyebrowStyles({ surface, class: className })} />;
}
