import { focusRing, tv } from "../lib/tv";

/**
 * One look for every form control (spec §7.4): 44px tall, a 3:1 border, the
 * shared focus ring, and a danger border while the field shows an error.
 * Select, Input and Textarea all read `control` so they line up in a form.
 */
export const fieldStyles = tv({
  slots: {
    root: "flex flex-col gap-1.5",
    label: "text-base font-semibold text-ink",
    optional: "font-normal text-muted",
    description: "text-sm text-muted",
    error: "flex items-start gap-1.5 text-sm font-semibold text-danger [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0",
    control: [
      "min-h-11 w-full rounded-md border border-input bg-surface px-3 py-2 text-base text-ink",
      "placeholder:text-muted disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted",
      "data-invalid:border-danger data-invalid:border-2",
      focusRing.default,
    ],
  },
  variants: {
    hideLabel: {
      true: { label: "sr-only" },
    },
  },
});

/** Shared by Checkbox and RadioCards so a ticked box and a chosen card read as one family. */
export const choiceStyles = tv({
  slots: {
    row: "flex min-h-11 cursor-pointer items-start gap-3 py-2 text-ink",
    box: [
      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm border-2 border-input bg-surface",
      "data-checked:border-action data-checked:bg-action",
      "data-disabled:cursor-not-allowed data-disabled:opacity-60",
      focusRing.default,
    ],
    check: "size-4 text-on-inverse",
    dot: [
      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 border-input bg-surface",
      "data-checked:border-action",
      focusRing.default,
    ],
    dotFill: "size-2.5 rounded-full bg-action",
  },
});
