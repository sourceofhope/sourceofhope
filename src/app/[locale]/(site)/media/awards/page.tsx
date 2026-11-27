import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ContentTemplate } from "@/components/layout/templates";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { AWARD_PHOTOS, AWARDS } from "@/content/awards";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("awardsTitle"), description: t("awardsMeta"), alternates: localeAlternates("/media/awards", locale) };
}

/* Awards & Recognition (spec §10.7): today's structure, restyled. */
export default async function AwardsPage() {
  const t = await getTranslations("About");
  const years = [...new Set(AWARDS.map((a) => a.year))];
  return (
    <ContentTemplate header={{ title: t("awardsTitle"), lead: t("awardsLead"), image: { src: "/v2/core/awards-humanitarian-stage-light.webp", alt: "", width: 1200, height: 800 } }}>
      <Section title={t("highlights")}>
        <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {AWARD_PHOTOS.map((photo) => (
            <li key={photo.src} className="flex flex-col gap-3">
              <Image src={photo.src} alt={photo.alt} width={800} height={600} radius="lg" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-4/3 w-full object-cover" />
              <p className="text-sm font-semibold text-info">{photo.caption}</p>
              <p className="text-ink-soft">{photo.title}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={t("timeline")} tone="muted" width="prose">
        <ol className="m-0 flex list-none flex-col gap-10 p-0">
          {years.map((year) => (
            <li key={year} className="grid gap-4 md:grid-cols-4">
              <Heading level={3} size="2xl">
                {year}
              </Heading>
              <ul className="m-0 flex list-none flex-col gap-5 border-l-2 border-line p-0 pl-6 md:col-span-3">
                {AWARDS.filter((a) => a.year === year).map((award) => (
                  <li key={award.title} className="flex flex-col gap-1">
                    <p className="font-semibold text-ink">{award.title}</p>
                    {award.description ? <p className="text-ink-soft">{award.description}</p> : null}
                    {award.tag ? (
                      <div>
                        <Badge tone="info">{award.tag}</Badge>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>
    </ContentTemplate>
  );
}
