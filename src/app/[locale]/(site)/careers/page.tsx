import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { HubLinkButton } from "@/components/layout/hub-link";
import { Section } from "@/components/layout/section";
import { ContentTemplate } from "@/components/layout/templates";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ExternalLink } from "@/components/ui/link";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Careers");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("title"), description: t("meta"), alternates: localeAlternates("/careers", locale) };
}

const HANDSHAKE = "https://app.joinhandshake.com/e/806999/jobs";

/* Careers (spec §10.8): open roles on Handshake, work-study, and volunteering. */
export default async function CareersPage() {
  const t = await getTranslations("Careers");
  const blocks = [
    { id: "roles", title: t("rolesTitle"), text: t("rolesText"), action: <ExternalLink href={HANDSHAKE} newTab>{t("handshake")}</ExternalLink> },
    { id: "work-study", title: t("workStudyTitle"), text: t("workStudyText"), action: null },
    {
      id: "volunteer",
      title: t("volunteerTitle"),
      text: t("volunteerText"),
      action: (
        <HubLinkButton hub={{ action: "volunteer" }} variant="secondary">
          {t("volunteer")}
        </HubLinkButton>
      ),
    },
  ];
  return (
    <ContentTemplate header={{ title: t("title"), lead: t("lead"), image: { src: "/v2/educationHope/Carousel-3.webp", alt: "", width: 1200, height: 800 } }}>
      <Section>
        <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
          {blocks.map((b) => (
            <Card key={b.id} as="li">
              <div className="flex h-full flex-col gap-3 p-6">
                <Heading level={2} size="xl">
                  {b.title}
                </Heading>
                <p className="text-ink-soft">{b.text}</p>
                {b.action ? <div className="mt-auto pt-2">{b.action}</div> : null}
              </div>
            </Card>
          ))}
        </ul>
      </Section>
    </ContentTemplate>
  );
}
