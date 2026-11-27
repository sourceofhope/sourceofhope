import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/layout/cta-band";
import { HubLinkButton } from "@/components/layout/hub-link";
import { Section } from "@/components/layout/section";
import { ContentTemplate } from "@/components/layout/templates";
import { LinkButton } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { SPONSORS } from "@/content/sponsors";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Partners");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("title"), description: t("meta"), alternates: localeAlternates("/about/partners", locale) };
}

/* Partners & Sponsors (spec §10.8): the sponsor grid, Community Sponsors, partner events. */
export default async function PartnersPage() {
  const t = await getTranslations("Partners");
  return (
    <ContentTemplate
      header={{ title: t("title"), lead: t("lead") }}
      cta={
        <CtaBand
          title={t("becomeTitle")}
          text={t("becomeText")}
          actions={
            <>
              <HubLinkButton hub={{ action: "give", type: "business" }} surface="inverse">
                {t("become")}
              </HubLinkButton>
              <LinkButton href="/contact" variant="secondary" surface="inverse">
                {t("talk")}
              </LinkButton>
            </>
          }
        />
      }
    >
      <Section title={t("sponsorsTitle")}>
        <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {SPONSORS.map((s) => (
            <li key={s.name} className="flex flex-col items-center gap-3 rounded-lg border border-line p-6">
              <Image src={s.logo} alt="" width={160} height={64} className="h-16 w-40 object-contain" />
              <p className="text-center font-semibold text-ink">{s.name}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={t("partnerEventsTitle")} tone="muted" width="prose">
        <p className="text-lg text-ink-soft">{t("partnerEventsText")}</p>
      </Section>
    </ContentTemplate>
  );
}
