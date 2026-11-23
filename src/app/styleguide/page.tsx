import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isStyleguideEnabled } from "./enabled";
import { SECTIONS } from "./sections";

/*
 * /styleguide: the living reference for tokens and components (spec §10.12).
 * Development and preview deployments only; production returns 404.
 */
export const metadata: Metadata = {
  title: "Styleguide · The Source of Hope",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function StyleguidePage() {
  if (!isStyleguideEnabled()) notFound();

  return (
    <main id="main" className="mx-auto flex max-w-page flex-col gap-12 px-4 py-section md:px-8 lg:px-10">
      <header className="flex flex-col gap-3 border-b border-line pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-info">Design system</p>
        <h1 className="font-heading text-4xl font-bold">Styleguide</h1>
        <p className="max-w-prose text-lg text-muted">
          Every token and component, in every state. Built from ADR-0009 and spec §5–§6. Not shown in production.
        </p>
        <nav aria-label="Styleguide sections">
          <ul className="flex flex-wrap gap-4 pt-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="font-semibold text-action underline-offset-4 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {SECTIONS.map(({ id, title, summary, Component }) => (
        <section key={id} id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-24 flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 id={`${id}-title`} className="font-heading text-3xl font-bold">
              {title}
            </h2>
            <p className="text-muted">{summary}</p>
          </div>
          <Component />
        </section>
      ))}
    </main>
  );
}
