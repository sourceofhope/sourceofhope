import type { ReactNode } from "react";
import { SkipLink } from "@/components/ui/skip-link";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";

/**
 * SiteShell: everything around a page (spec §8). Skip link first, then the
 * header, the page (a template, which provides `<main id="main">`), the
 * footer. (The toast region lives in the root layout.) Used by the (site) layout and by the
 * not-found and error pages, so they look like the rest of the site.
 */
export function SiteShell({ children, overlay }: { children: ReactNode; overlay?: boolean }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteHeader overlay={overlay} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
