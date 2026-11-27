import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { LandingTemplate } from "@/components/layout/templates";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TextLink } from "@/components/ui/link";
import { Stat, StatList } from "@/components/ui/stat";
import { EventCard } from "@/features/events/event-card";
import { HomeHero } from "@/features/home/home-hero";
import { SponsorStrip } from "@/features/home/sponsor-strip";
import { ProgramCard } from "@/features/programs/program-card";
import { StoryCard } from "@/features/stories/story-card";
import { formatDate, formatNumber } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { eventImage, getImpactStats, getPrograms, getStories } from "@/lib/content/loaders";
import { getUpcomingEvents } from "@/lib/db/events";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Home");
  const locale = (await getLocale()) as AppLocale;
  return { title: { absolute: t("metaTitle") }, description: t("metaDescription"), alternates: localeAlternates("/", locale) };
}

/* Home (spec §10.1): hero, sponsors, impact, upcoming events, programs, latest story. */
export default async function HomePage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Home");
  const [stats, events, programs, stories] = await Promise.all([
    getImpactStats(locale),
    getUpcomingEvents({ locale: locale.slice(0, 2), limit: 3 }),
    getPrograms(locale),
    getStories(1, locale),
  ]);
  const asOf = stats.map((s) => s.asOf).filter(Boolean).sort().pop();

  return (
    <LandingTemplate hero={<HomeHero />}>
      <SponsorStrip />

      <Section title={t("impact")} lead={asOf ? t("impactAsOf", { date: formatDate(new Date(`${asOf}T12:00:00Z`), locale, "long") }) : undefined}>
        <StatList>
          {stats.map((s) => (
            <Stat key={s.label} value={`${formatNumber(s.value, locale)}${s.suffix}`} label={s.label} />
          ))}
        </StatList>
      </Section>

      <Section title={t("events")} tone="muted" action={<TextLink href="/events">{t("eventsAll")}</TextLink>}>
        {events.length ? (
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} image={eventImage(event)} />
            ))}
          </ul>
        ) : (
          <EmptyState
            level={3}
            title={t("eventsEmptyTitle")}
            action={
              <LinkButton href="/events" variant="secondary">
                {t("eventsAll")}
              </LinkButton>
            }
          >
            {t("eventsEmptyText")}
          </EmptyState>
        )}
      </Section>

      <Section title={t("programs")} action={<TextLink href="/programs">{t("programsAll")}</TextLink>}>
        <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.key} program={program} />
          ))}
        </ul>
      </Section>

      {stories[0] ? (
        <Section title={t("story")} tone="muted" action={<TextLink href="/media">{t("storyMore")}</TextLink>}>
          <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-2">
            <StoryCard story={stories[0]} />
          </ul>
        </Section>
      ) : null}
    </LandingTemplate>
  );
}
