"use client";

import { useLocale, useTranslations } from "next-intl";
import { HandRaisedIcon } from "@heroicons/react/24/outline";
import { Disclosure } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { NewsletterForm } from "@/components/layout/site-footer";
import { VOLUNTEER_FAQS } from "@/content/faqs";
import { formatEventDate, formatTimeRange } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import type { HubEventSummary } from "@/lib/hub-data";
import { useHub } from "./hub-context";
import { HubLanding, HubLoading, HubTitle } from "./hub-frame";
import { HubError } from "./hub-states";
import { useHubData } from "./use-hub-data";

function EventChoice({ event }: { event: HubEventSummary }) {
  const t = useTranslations("Hub.volunteer");
  const e = useTranslations("Events");
  const hub = useHub();
  const locale = useLocale() as AppLocale;
  const starts = new Date(event.startsAt);
  const full = event.spotsLeft === 0;
  return (
    <Card as="li">
      <div className="flex flex-col gap-2 p-4">
        <Heading level={3} size="xl">
          {event.title}
        </Heading>
        <p className="m-0 text-ink-soft">
          <time dateTime={event.startsAt}>{e("at", { date: formatEventDate(starts, locale), time: formatTimeRange(starts, new Date(event.endsAt), locale) })}</time>
          {event.venueName ? ` · ${event.venueName}` : null}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {event.signupClosed ? (
            <Badge tone="neutral">{t("closed")}</Badge>
          ) : full ? (
            <Badge tone="neutral">{t("full")}</Badge>
          ) : (
            <span className="text-sm text-ink-soft">{t("spotsLeft", { count: event.spotsLeft ?? 0 })}</span>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="tertiary" size="sm" aria-label={t("detailsFor", { name: event.title })} onClick={() => hub.push({ action: "event", event: event.slug, view: "volunteer" })}>
              {t("details")}
            </Button>
            {!event.signupClosed && !full ? (
              <Button type="button" variant="secondary" size="sm" aria-label={t("chooseFor", { name: event.title })} onClick={() => hub.push({ action: "volunteer", event: event.slug, step: "shift" })}>
                {t("choose")}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Volunteer, step 1 (spec §9.6): choose an event with open shifts. */
export function VolunteerLanding() {
  const t = useTranslations("Hub.volunteer");
  const hub = useHub();
  const data = useHubData<{ events: HubEventSummary[] }>(`/api/hub/volunteer?lang=${hub.lang}`);
  return (
    <HubLanding door="volunteer">
      <HubTitle intro={t("intro")}>{t("title")}</HubTitle>
      <Disclosure label={t("howItWorks")}>
        <dl className="m-0 flex flex-col gap-3">
          {VOLUNTEER_FAQS.map((faq) => (
            <div key={faq.id}>
              <dt className="font-semibold text-ink">{faq.question}</dt>
              {faq.answer.map((paragraph) => (
                <dd key={paragraph} className="m-0 text-ink-soft">
                  {paragraph}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </Disclosure>
      {data.status === "loading" ? <HubLoading /> : null}
      {data.status === "error" || data.status === "not-found" ? <HubError onRetry={data.retry} /> : null}
      {data.status === "ready" && data.data.events.length ? (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {data.data.events.map((event) => (
            <EventChoice key={event.slug} event={event} />
          ))}
        </ul>
      ) : null}
      {data.status === "ready" && !data.data.events.length ? (
        <EmptyState title={t("emptyTitle")} level={3} icon={<HandRaisedIcon />} action={<TextLink href="/programs">{t("seePrograms")}</TextLink>}>
          <p className="m-0">{t("emptyText")}</p>
          <div className="pt-4 text-left">
            <NewsletterForm />
          </div>
        </EmptyState>
      ) : null}
    </HubLanding>
  );
}
