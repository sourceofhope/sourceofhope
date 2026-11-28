"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDaysIcon, LinkIcon } from "@heroicons/react/24/outline";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { ExternalLink, TextLink } from "@/components/ui/link";
import { Tab, Tabs, TabsList, TabsPanel } from "@/components/ui/tabs";
import { formatEventDate, formatTimeRange } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import type { HubEvent } from "@/lib/hub-data";
import { eventSide, type EventView } from "@/lib/hub-url";
import { useHub } from "./hub-context";
import { HubActions, HubLoading, HubSheet, HubTitle } from "./hub-frame";
import { HubError } from "./hub-states";
import { useHubData } from "./use-hub-data";

/** Google Maps search link: no key, nothing loads until it's followed (02 §6). */
export function directionsUrl(address: string): `https://${string}` {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function useHubEvent(slug: string) {
  const { lang } = useHub();
  return useHubData<{ event: HubEvent }>(`/api/hub/event/${slug}?lang=${lang}`);
}

function Facts({ rows }: { rows: [string, ReactNode][] }) {
  const shown = rows.filter(([, value]) => value);
  if (!shown.length) return null;
  return (
    <dl className="m-0 grid gap-4 sm:grid-cols-2">
      {shown.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1">
          <dt className="text-sm font-semibold text-muted">{label}</dt>
          <dd className="m-0 text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function languageNames(codes: string[], locale: string): string | null {
  if (!codes.length) return null;
  const names = new Intl.DisplayNames([locale], { type: "language" });
  return codes.map((code) => names.of(code) ?? code).join(", ");
}

function GuestSide({ event }: { event: HubEvent }) {
  const t = useTranslations("Hub.event");
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-5">
      <Alert tone="info">{t("justCome")}</Alert>
      <Facts
        rows={[
          [t("whoFor"), event.guest.who],
          [t("bring"), event.guest.bring],
          [t("cost"), event.guest.cost],
          [t("languages"), languageNames(event.languages, locale)],
          [t("accessibility"), event.guest.accessibility],
        ]}
      />
    </div>
  );
}

function VolunteerSide({ event }: { event: HubEvent }) {
  const t = useTranslations("Hub.event");
  const locale = useLocale() as AppLocale;
  const rules = [
    event.minAge ? t("minAge", { age: event.minAge }) : null,
    t("accompany", { age: event.accompanyUnderAge }),
    event.requiredAgreements.includes("serving_hope_addendum") ? t("agreementAddendum") : t("agreement"),
  ].filter((rule): rule is string => rule !== null);
  return (
    <div className="flex flex-col gap-5">
      {event.signupClosed ? <Alert tone="warning">{t("closed")}</Alert> : null}
      <section aria-labelledby="hub-shifts" className="flex flex-col gap-3">
        <Heading level={3} size="xl" id="hub-shifts">
          {t("shifts")}
        </Heading>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {event.shifts.map((shift) => (
            <li key={shift.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line px-4 py-3">
              <span className="flex flex-col">
                <span className="font-semibold text-ink">{shift.label}</span>
                <span className="text-sm text-muted">{formatTimeRange(new Date(shift.startsAt), new Date(shift.endsAt), locale)}</span>
              </span>
              {shift.spotsLeft > 0 ? <span className="text-sm text-ink-soft">{t("spotsLeft", { count: shift.spotsLeft })}</span> : <Badge tone="neutral">{t("full")}</Badge>}
            </li>
          ))}
        </ul>
      </section>
      <ul className="m-0 flex flex-col gap-1 pl-5 text-ink-soft">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <Facts
        rows={[
          [t("expect"), event.volunteer.expect],
          [t("wear"), event.volunteer.wear],
        ]}
      />
    </div>
  );
}

function ShareActions({ event }: { event: HubEvent }) {
  const t = useTranslations("Hub.event");
  const { lang } = useHub();
  const [copied, setCopied] = useState<"yes" | "failed" | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <a href={`/api/hub/event/${event.slug}/ics?lang=${lang}`} download={`${event.slug}.ics`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
          <CalendarDaysIcon aria-hidden="true" />
          {t("addToCalendar")}
        </a>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={async () => {
            const url = `${window.location.origin}${window.location.pathname}?event=${event.slug}`;
            try {
              await navigator.clipboard.writeText(url);
              setCopied("yes");
            } catch {
              setCopied("failed");
            }
          }}
        >
          <LinkIcon aria-hidden="true" />
          {t("copyLink")}
        </Button>
      </div>
      <p role="status" className="m-0 min-h-6 text-sm text-muted">
        {copied === "yes" ? t("copied") : copied === "failed" ? t("copyFailed") : null}
      </p>
    </div>
  );
}

/**
 * Two-sided event details (spec §9.4): guest and volunteer information,
 * one shown at a time; a partner event links out instead. `fixedSide`
 * shows one side without the toggle (Get Help shows the guest side).
 */
export function EventDetailsBody({
  event,
  side,
  onSideChange,
  fixedSide,
}: {
  event: HubEvent;
  side: EventView;
  onSideChange?: (side: EventView) => void;
  fixedSide?: boolean;
}) {
  const t = useTranslations("Hub.event");
  const e = useTranslations("Events");
  const locale = useLocale() as AppLocale;
  const starts = new Date(event.startsAt);
  const both = event.hasGuestInfo && event.hasVolunteerInfo && !fixedSide;
  const where = [event.venueName, event.address].filter(Boolean).join(", ");

  return (
    <>
      <Image src={event.image.src} alt={event.image.alt} width={event.image.width} height={event.image.height} sizes="(min-width: 768px) 640px, 100vw" radius="md" className="aspect-video w-full object-cover" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {event.partner ? <Badge tone="neutral">{e("badges.partner")}</Badge> : null}
          {event.hasGuestInfo ? <Badge tone="public">{e("badges.public")}</Badge> : null}
          {event.hasVolunteerInfo ? <Badge tone="volunteer">{e("badges.volunteer")}</Badge> : null}
        </div>
        <HubTitle>{event.title}</HubTitle>
        <p className="m-0 text-ink-soft">
          <time dateTime={event.startsAt}>{e("at", { date: formatEventDate(starts, locale), time: formatTimeRange(starts, new Date(event.endsAt), locale) })}</time>
          {where ? ` · ${where}` : null}
        </p>
        {event.address ? (
          <p className="m-0">
            <ExternalLink href={directionsUrl(event.address)} newTab>
              {t("directions")}
            </ExternalLink>
          </p>
        ) : null}
      </div>
      {event.summary ? <p className="m-0 text-ink">{event.summary}</p> : null}
      {event.partner ? (
        <div className="flex flex-col gap-3">
          <p className="m-0 text-ink-soft">{t("partnerNote", { partner: event.partner.name })}</p>
          {event.hasGuestInfo ? <GuestSide event={event} /> : null}
        </div>
      ) : both ? (
        <Tabs value={side} onValueChange={(value) => value && onSideChange?.(value as EventView)}>
          <TabsList aria-label={t("sides")}>
            <Tab value="guest">{t("guest")}</Tab>
            <Tab value="volunteer">{t("volunteer")}</Tab>
          </TabsList>
          <div className="pt-5">
            <TabsPanel value="guest">
              <GuestSide event={event} />
            </TabsPanel>
            <TabsPanel value="volunteer">
              <VolunteerSide event={event} />
            </TabsPanel>
          </div>
        </Tabs>
      ) : side === "guest" || !event.hasVolunteerInfo ? (
        <GuestSide event={event} />
      ) : (
        <VolunteerSide event={event} />
      )}
      <ShareActions event={event} />
    </>
  );
}

/** The action bar for event details: the one next step for the side shown. */
export function EventDetailsActions({ event, side }: { event: HubEvent; side: EventView }) {
  const t = useTranslations("Hub.event");
  const hub = useHub();
  if (event.partner) {
    return (
      <HubActions>
        <a href={event.partner.signupUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "primary" })}>
          {t("partnerSignup", { partner: event.partner.name })}
        </a>
      </HubActions>
    );
  }
  if (side !== "volunteer" || !event.hasVolunteerInfo || event.signupClosed) return null;
  return (
    <HubActions>
      <Button type="button" onClick={() => hub.push({ action: "volunteer", event: event.slug, step: "shift" })}>
        {t("volunteerCta")}
      </Button>
    </HubActions>
  );
}

/** `?event=<slug>` on its own: event details with no tabs (spec §9.1). */
export function EventDetails({ slug, view }: { slug: string; view?: EventView }) {
  const t = useTranslations("Hub.event");
  const hub = useHub();
  const data = useHubEvent(slug);

  if (data.status === "loading") {
    return (
      <HubSheet>
        <HubLoading />
      </HubSheet>
    );
  }
  if (data.status === "error") {
    return (
      <HubSheet>
        <HubError onRetry={data.retry} />
      </HubSheet>
    );
  }
  if (data.status === "not-found") {
    return (
      <HubSheet>
        <HubTitle>{t("notFoundTitle")}</HubTitle>
        <p className="m-0 text-ink-soft">{t("notFoundText")}</p>
        <p className="m-0">
          <TextLink href="/events">{t("seeEvents")}</TextLink>
        </p>
      </HubSheet>
    );
  }

  const { event } = data.data;
  const side = eventSide({ view, hasGuest: event.hasGuestInfo, hasVolunteer: event.hasVolunteerInfo });
  return (
    <>
      <HubSheet>
        <EventDetailsBody event={event} side={side} onSideChange={(next) => hub.replace({ action: "event", event: slug, view: next })} />
      </HubSheet>
      <EventDetailsActions event={event} side={side} />
    </>
  );
}
