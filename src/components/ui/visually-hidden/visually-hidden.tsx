import type { ComponentProps } from "react";

/** VisuallyHidden: text for screen readers only (labels, status words). */
export function VisuallyHidden(props: ComponentProps<"span">) {
  return <span {...props} className="sr-only" />;
}
