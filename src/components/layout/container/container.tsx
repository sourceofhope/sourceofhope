import type { ReactNode } from "react";

/**
 * Container: the page width (1240px) and gutters (16 / 32 / 40px, spec §5.3).
 * Everything on a page sits in one. `width="prose"` narrows it to a reading
 * measure for long text (Content and Utility pages).
 */
export function Container({ width = "page", children }: { width?: "page" | "prose"; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-page px-4 md:px-8 lg:px-10">
      {width === "prose" ? <div className="max-w-prose">{children}</div> : children}
    </div>
  );
}
