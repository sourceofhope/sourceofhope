import { tv } from "../lib/tv";

const spinnerStyles = tv({
  base: "size-5 shrink-0 animate-spin motion-reduce:animate-none",
});

/**
 * Spinner: the one loading indicator (replaces five copy-pasted SVGs).
 * Decorative: the surrounding component announces the state (e.g. Button's
 * "Working…"). Under reduced motion it holds still.
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={spinnerStyles({ class: className })}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
