import { useLocale, useTranslations } from "next-intl";
import { Prose } from "@/components/layout/prose";
import { Section } from "@/components/layout/section";
import { ContentTemplate } from "@/components/layout/templates";
import { Alert } from "@/components/ui/alert";
import { LEGAL_APPROVED, LEGAL_UPDATED, type LegalSection } from "@/content/legal";
import { formatDate } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";

/** A legal page (slice 3.8): Content template, contents list, "pending review" until approved. */
export function LegalPage({ title, sections }: { title: string; sections: readonly LegalSection[] }) {
  const t = useTranslations("Legal");
  const locale = useLocale() as AppLocale;
  return (
    <ContentTemplate header={{ title, lead: t("updated", { date: formatDate(new Date(`${LEGAL_UPDATED}T12:00:00Z`), locale, "long") }) }}>
      <Section width="prose">
        <div className="flex flex-col gap-10">
          {LEGAL_APPROVED ? null : <Alert tone="warning">{t("pending")}</Alert>}
          <nav aria-labelledby="legal-contents">
            <h2 id="legal-contents" className="mb-3 font-heading text-xl font-bold text-ink">
              {t("contents")}
            </h2>
            <ol className="m-0 flex list-decimal flex-col gap-1 pl-6 text-action">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="font-semibold underline underline-offset-4">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <Prose>
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
                <h2 id={`${s.id}-title`}>{s.title}</h2>
                {s.list ? (
                  <ul>
                    {s.list.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {s.paragraphs?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              </section>
            ))}
          </Prose>
        </div>
      </Section>
    </ContentTemplate>
  );
}
