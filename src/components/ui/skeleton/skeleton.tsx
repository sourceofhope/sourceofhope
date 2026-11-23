import { tv } from "../lib/tv";

const skeletonStyles = tv({
  base: "animate-pulse rounded-sm bg-line-soft motion-reduce:animate-none",
});

/**
 * Skeleton: a placeholder block while content loads (spec §9.8). Decorative;
 * the loading state is announced by the region that owns it. Size it with
 * className (h-*, w-*), which is placement, not look.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={skeletonStyles({ class: className })} />;
}
