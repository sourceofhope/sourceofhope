import type { ComponentProps } from "react";
import { tv, type VariantProps } from "../lib/tv";

const statStyles = tv({
  slots: {
    list: "m-0 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4",
    item: "flex flex-col-reverse gap-1 border-l-4 border-action pl-4",
    label: "text-sm md:text-base",
    value: "m-0 font-heading text-3xl font-bold md:text-4xl",
  },
  variants: {
    surface: {
      default: { label: "text-ink-soft", value: "text-ink" },
      inverse: { label: "text-on-inverse-muted", value: "text-on-inverse", item: "border-on-inverse" },
    },
  },
  defaultVariants: { surface: "default" },
});

type StatSurface = VariantProps<typeof statStyles>;

/** StatList: a row of impact numbers. Wrap Stats in it (it renders a <dl>). */
export function StatList({ surface, className, ...props }: ComponentProps<"dl"> & StatSurface) {
  return <dl {...props} className={statStyles({ surface }).list({ class: className })} />;
}

/**
 * Stat: one real number with its label (spec §6). The value is already
 * formatted (see src/i18n/format.ts) and rendered on the server: no count-up,
 * so screen readers and crawlers get the real figure.
 */
export function Stat({ value, label, surface }: { value: string; label: string } & StatSurface) {
  const s = statStyles({ surface });
  return (
    <div className={s.item()}>
      <dt className={s.label()}>{label}</dt>
      <dd className={s.value()}>{value}</dd>
    </div>
  );
}
