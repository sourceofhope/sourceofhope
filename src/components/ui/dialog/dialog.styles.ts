import { tv, type VariantProps } from "../lib/tv";

/**
 * Dialog layouts (spec §9.3):
 *  - dialog:   centered, 640px wide, scrolls inside (all screens)
 *  - takeover: the Hub — centered on ≥md, full screen on phones
 *  - fullscreen: the mobile menu sheet — full screen everywhere
 */
export const dialogStyles = tv({
  slots: {
    backdrop: [
      "fixed inset-0 bg-scrim",
      "transition-opacity duration-(--duration-slow) ease-standard motion-reduce:transition-none",
      "data-starting-style:opacity-0 data-ending-style:opacity-0",
    ],
    content: [
      "fixed m-auto flex flex-col overflow-hidden bg-surface text-ink shadow-overlay outline-none",
      "transition duration-(--duration-slow) ease-standard motion-reduce:transition-none",
    ],
    header: "flex items-start gap-3 border-b border-line-soft px-4 py-3 md:px-6",
    titleGroup: "flex min-w-0 flex-1 flex-col gap-1 py-2",
    title: "font-heading text-2xl font-bold text-ink",
    description: "text-sm text-muted",
    body: "min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6",
    footer: "flex flex-wrap items-center justify-end gap-3 border-t border-line px-4 py-3 md:px-6",
  },
  variants: {
    layout: {
      dialog: {
        content: [
          "inset-4 h-fit max-h-(--dialog-max-height) w-auto max-w-dialog rounded-lg md:w-full",
          "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
          "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        ],
      },
      takeover: {
        content: [
          // Phones: the whole screen, sliding up (spec §9.3).
          "inset-0 h-dvh max-h-none w-full max-w-none rounded-none",
          "data-starting-style:translate-y-8 data-starting-style:opacity-0 data-ending-style:translate-y-8 data-ending-style:opacity-0",
          // ≥md: a centered dialog that fades and scales.
          "md:inset-4 md:h-fit md:max-h-(--dialog-max-height) md:max-w-dialog md:rounded-lg",
          "md:data-starting-style:translate-y-0 md:data-starting-style:scale-95 md:data-ending-style:translate-y-0 md:data-ending-style:scale-95",
          "motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-ending-style:translate-y-0",
        ],
      },
      fullscreen: {
        content: [
          "inset-0 h-dvh max-h-none w-full max-w-none rounded-none",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
        ],
      },
    },
  },
  defaultVariants: { layout: "dialog" },
});

export type DialogLayout = NonNullable<VariantProps<typeof dialogStyles>["layout"]>;
