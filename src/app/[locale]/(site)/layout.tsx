import { SiteShell } from "@/components/layout/site-shell";

/*
 * Shell for rebuilt pages. Phase 3 moves each page here from (legacy) as it
 * is rebuilt. Route groups don't appear in URLs.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
