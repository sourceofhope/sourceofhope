import type { ReactNode } from "react";

/**
 * Main: the page's one `<main>`, target of the skip link. Only templates
 * render it, so every page gets exactly one. `tabIndex={-1}` lets the skip
 * link move focus here in every browser.
 */
export function Main({ children }: { children: ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {children}
    </main>
  );
}
