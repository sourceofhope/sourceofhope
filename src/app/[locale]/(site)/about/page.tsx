import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/layout/cta-band";
import { HubLinkButton } from "@/components/layout/hub-link";
import { Prose } from "@/components/layout/prose";
import { Section } from "@/components/layout/section";
import { ContentTemplate } from "@/components/layout/templates";
import { Heading } from "@/components/ui/heading";
import { ExternalLink, TextLink } from "@/components/ui/link";
import { ORGANIZATION } from "@/content/organization";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { getOurStory } from "@/lib/content/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("storyTitle"), description: t("storyMeta"), alternates: localeAlternates("/about", locale) };
}

/* About: Our Story (spec §10.5), on the Content template. */
export default async function OurStoryPage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const actions = await getTranslations("Shell.actions");
  const story = await getOurStory(locale);

  return (
    <ContentTemplate
      header={{ title: t("storyTitle"), lead: t("storyLead"), image: { src: "/v2/core/TSOH-Group.webp", alt: "", width: 1200, height: 800 } }}
      cta={
        <CtaBand
          title={t("ctaTitle")}
          text={t("ctaText")}
          actions={
            <>
              <HubLinkButton hub={{ action: "give" }} surface="inverse">
                {actions("give")}
              </HubLinkButton>
              <HubLinkButton hub={{ action: "volunteer" }} variant="secondary" surface="inverse">
                {actions("volunteer")}
              </HubLinkButton>
            </>
          }
        />
      }
    >
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <section aria-labelledby="mission" className="flex flex-col gap-3 border-l-4 border-action pl-6">
            <Heading level={2} size="2xl" id="mission">
              {t("mission")}
            </Heading>
            <p className="text-xl text-ink-soft">{story.mission}</p>
          </section>
          <section aria-labelledby="vision" className="flex flex-col gap-3 border-l-4 border-action pl-6">
            <Heading level={2} size="2xl" id="vision">
              {t("vision")}
            </Heading>
            <p className="text-xl text-ink-soft">{story.vision}</p>
          </section>
        </div>
      </Section>
      <Section title={t("story")} tone="muted" width="prose">
        <Prose>
          {story.story.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </Prose>
      </Section>
      <Section title={t("howWeWork")} width="prose">
        <Prose>
          {story.howWeWork.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </Prose>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <TextLink href="/about/team">{t("team")}</TextLink>
          <ExternalLink href={ORGANIZATION.candid.profile}>{t("candid")}</ExternalLink>
        </div>
      </Section>
    </ContentTemplate>
  );
}
