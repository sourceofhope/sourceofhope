import type { ComponentProps, HTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";
import { tv, type VariantProps } from "../lib/tv";

const cardStyles = tv({
  base: "relative flex flex-col overflow-hidden rounded-md border border-line bg-surface",
  variants: {
    /** Interactive cards lift on hover; pair with a CardLink. */
    interactive: { true: "transition-shadow duration-(--duration-fast) hover:shadow-raised motion-reduce:transition-none" },
    tone: { default: "", muted: "border-transparent bg-surface-muted" },
  },
  defaultVariants: { tone: "default" },
});

type CardOwnProps = VariantProps<typeof cardStyles> & { as?: "article" | "div" | "li" };

/**
 * Card: one container look for events, programs, stories and products.
 * The whole card is clickable only through a single CardLink inside it:
 * never wrap a card in a link or nest buttons in a link (spec §6).
 */
export function Card({ as: Tag = "article", interactive, tone, className, ...props }: HTMLAttributes<HTMLElement> & CardOwnProps) {
  return <Tag {...props} className={cardStyles({ interactive, tone, class: className })} />;
}

const cardLinkStyles = tv({
  base: [
    "font-heading font-bold text-ink no-underline hover:text-action",
    // Stretch the link over the whole card; the focus ring follows the card's shape.
    "after:absolute after:inset-0 after:rounded-md",
    "outline-none focus-visible:after:ring-2 focus-visible:after:ring-focus focus-visible:after:ring-offset-2",
  ],
});

/** CardLink: the card's title link, stretched to make the whole card clickable. */
export function CardLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={cardLinkStyles({ class: className })} />;
}
