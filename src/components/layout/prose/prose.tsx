import type { ReactNode } from "react";

/**
 * Prose: long-form body text (Our Story, a team bio, Privacy). Spaces and
 * styles plain HTML children (p, h2, h3, ul, ol, strong, a), so Sanity's
 * rich text renders with the same rhythm everywhere. Headings inside follow
 * the page outline: h2 for sections, h3 below.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "max-w-prose text-lg text-ink-soft",
        "[&>*+*]:mt-5",
        "[&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink",
        "[&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li+li]:mt-2",
        "[&_strong]:font-semibold [&_strong]:text-ink",
        "[&_a]:font-semibold [&_a]:text-action [&_a]:underline [&_a]:underline-offset-4",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
