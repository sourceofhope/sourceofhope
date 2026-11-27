import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ListingTemplate } from "@/components/layout/templates";
import { Disclosure } from "@/components/ui/accordion";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { NavLink } from "@/components/ui/link";
import { EventCard } from "@/features/events/event-card";
import { applyFilter, EVENT_FILTERS, eventJsonLd, groupByMonth, parseFilter } from "@/features/events/event-list";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates, SITE_URL } from "@/i18n/metadata";
import { eventImage, getRecurringPrograms } from "@/lib/content/loaders";
import { getRecentEvents, getUpcomingEvents } from "@/lib/db/events";

type Props = { searchParams: Promise<{ show?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Events");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("title"), description: t("metaDescription"), alternates: localeAlternates("/events", locale) };
}

/* Events (spec §10.4): filters, upcoming by month, every month, recent. Details open in the Hub. */
export default async function EventsPage({ searchParams }: Props) {
  const locale = (await getLocale()) as AppLocale;
  const lang = locale.slice(0, 2);
  const t = await getTranslations("Events");
  const filter = parseFilter((await searchParams).show);
  const [upcoming, recurring, recent] = await Promise.all([getUpcomingEvents({ locale: lang, limit: 60 }), getRecurringPrograms(locale), getRecentEvents({ locale: lang, limit: 6 })]);
  const shown = applyFilter(upcoming, filter);
  const months = groupByMonth(shown, locale);
  const jsonLd = upcoming.map((e) => eventJsonLd(e, SITE_URL, eventImage(e).src));

  return (
    <ListingTemplate
      header={{ title: t("title"), lead: t("lead") }}
      filters={
        <nav aria-label={t("filterLabel")}>
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 border-b border-line p-0">
            {EVENT_FILTERS.map((f) => (
              <li key={f}>
                <NavLink href={f === "all" ? "/events" : { pathname: "/events", query: { show: f } }} current={f === filter} scroll={false}>
                  {t(`filters.${f}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      }
    >
      {jsonLd.length ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      ) : null}

      {months.length ? (
        <div className="flex flex-col gap-12">
          {months.map((month) => (
            <section key={month.key} aria-labelledby={`month-${month.key}`} className="flex flex-col gap-6">
              <Heading level={2} size="2xl" id={`month-${month.key}`}>
                {month.label}
              </Heading>
              <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {month.events.map((event) => (
                  <EventCard key={event.id} event={event} image={eventImage(event)} level={3} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          level={2}
          title={t("emptyTitle")}
          action={
            filter === "all" ? undefined : (
              <LinkButton href="/events" variant="secondary">
                {t("showAll")}
              </LinkButton>
            )
          }
        >
          {t("emptyText")}
        </EmptyState>
      )}

      {recurring.length ? (
        <div className="mt-section">
          <section aria-labelledby="every-month" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Heading level={2} size="2xl" id="every-month">
                {t("everyMonth")}
              </Heading>
              <p className="text-lg text-muted">{t("everyMonthLead")}</p>
            </div>
            <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {recurring.map((r) => (
                <Card key={r.id} as="li">
                  {r.image ? <Image src={r.image.src} alt={r.image.alt} width={r.image.width} height={r.image.height} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-video w-full object-cover" /> : null}
                  <div className="flex flex-col gap-2 p-5">
                    <Heading level={3} size="xl">
                      {r.title}
                    </Heading>
                    {r.cadence ? <p className="font-semibold text-ink-soft">{r.cadence}</p> : null}
                    {r.location ? <p className="text-sm text-muted">{r.location}</p> : null}
                    {r.summary ? <p className="line-clamp-3 text-ink-soft">{r.summary}</p> : null}
                  </div>
                </Card>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {recent.length ? (
        <div className="mt-section">
          <section aria-labelledby="recent-events" className="flex flex-col gap-4">
              <Heading level={2} size="2xl" id="recent-events">
                {t("recent")}
              </Heading>
              <Disclosure label={t("recentToggle", { count: recent.length })}>
                <ul className="m-0 mt-4 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {recent.map((event) => (
                    <EventCard key={event.id} event={event} image={eventImage(event)} level={3} />
                  ))}
                </ul>
              </Disclosure>
          </section>
        </div>
      ) : null}
    </ListingTemplate>
  );
}
