"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ExternalLink } from "@/components/ui/link";
import { RadioCards } from "@/components/ui/radio-cards";
import { ORGANIZATION } from "@/content/organization";
import type { HelpService } from "@/content/services";
import { formatEventDate, formatTimeRange } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import type { HelpData } from "@/lib/hub-data";
import { HELP_NEEDS, type HelpNeed } from "@/lib/hub-url";
import { directionsUrl, EventDetailsBody, languageNames, useHubEvent } from "./event-details";
import { useHub } from "./hub-context";
import { HubLanding, HubLoading, HubStep, HubTitle } from "./hub-frame";
import { HubError } from "./hub-states";
import { useHubData } from "./use-hub-data";

/*
 * Get Help (spec §9.5): need → services and events → detail. For people
 * who may be stressed, on a phone and on slow data: short words, few
 * images, no forms, nothing personal collected, no third-party requests.
 */

/** On every Get Help step (spec §9.5). */
function EmergencyFooter() {
  const t = useTranslations("Hub.help");
  return (
    <aside aria-label={t("emergencyLabel")} className="shrink-0 border-t border-line-soft bg-surface-muted px-4 py-3 text-sm text-ink md:px-6">
      {t.rich("emergency", {
        emergency: (chunks) => <a href="tel:911" className="font-semibold text-ink underline">{chunks}</a>,
        crisis: (chunks) => <a href="tel:988" className="font-semibold text-ink underline">{chunks}</a>,
        other: (chunks) => <a href="tel:211" className="font-semibold text-ink underline">{chunks}</a>,
      })}
    </aside>
  );
}

function SomethingElse() {
  const t = useTranslations("Hub.help");
  return (
    <Alert tone="info" title={t("otherTitle")}>
      <p className="m-0">
        {t.rich("otherText", {
          call: (chunks) => <a href="tel:211" className="font-semibold underline">{chunks}</a>,
          site: (chunks) => (
            <ExternalLink href="https://www.211texas.org/" newTab>
              {chunks}
            </ExternalLink>
          ),
        })}
      </p>
    </Alert>
  );
}

function HelpLanding({ initial }: { initial?: HelpNeed }) {
  const t = useTranslations("Hub.help");
  const hub = useHub();
  const [need, setNeed] = useState<HelpNeed | null>(initial ?? null);
  const [error, setError] = useState(false);
  return (
    <HubLanding
      door="help"
      after={<EmergencyFooter />}
      actions={
        need === "other" ? null : (
          <Button
            type="button"
            onClick={() => {
              if (!need) return setError(true);
              hub.push({ action: "help", need });
            }}
          >
            {t("continue")}
          </Button>
        )
      }
    >
      <HubTitle intro={t("intro")}>{t("title")}</HubTitle>
      <RadioCards
        label={t("needLabel")}
        options={HELP_NEEDS.map((value) => ({ value, label: t(`needs.${value}`) }))}
        value={need}
        onValueChange={(value) => {
          setNeed(value);
          setError(false);
        }}
        error={error ? t("needError") : undefined}
      />
      {need === "other" ? <SomethingElse /> : null}
    </HubLanding>
  );
}

function ServiceCard({ service, need }: { service: HelpService; need: HelpNeed }) {
  const t = useTranslations("Hub.help");
  const hub = useHub();
  return (
    <Card as="li">
      <div className="flex flex-col gap-2 p-4">
        <Heading level={3} size="xl">
          {service.name}
        </Heading>
        <p className="m-0 text-ink-soft">{service.summary}</p>
        <div>
          <Button type="button" variant="secondary" size="sm" aria-label={t("detailsFor", { name: service.name })} onClick={() => hub.push({ action: "help", need, service: service.slug })}>
            {t("details")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function HelpResults({ need }: { need: Exclude<HelpNeed, "other"> }) {
  const t = useTranslations("Hub.help");
  const hub = useHub();
  const locale = useLocale() as AppLocale;
  const data = useHubData<HelpData>(`/api/hub/help?need=${need}&lang=${hub.lang}`);
  return (
    <HubStep label={t("door")} parent={{ action: "help" }} after={<EmergencyFooter />}>
      <HubTitle>{t(`results.${need}`)}</HubTitle>
      {data.status === "loading" ? <HubLoading /> : null}
      {data.status === "error" || data.status === "not-found" ? <HubError onRetry={data.retry} /> : null}
      {data.status === "ready" ? (
        <>
          {data.data.services.length ? (
            <section aria-labelledby="help-services" className="flex flex-col gap-3">
              <Heading level={3} size="xl" id="help-services">
                {t("services")}
              </Heading>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {data.data.services.map((service) => (
                  <ServiceCard key={service.slug} service={service} need={need} />
                ))}
              </ul>
            </section>
          ) : null}
          {data.data.events.length ? (
            <section aria-labelledby="help-events" className="flex flex-col gap-3">
              <Heading level={3} size="xl" id="help-events">
                {t("events")}
              </Heading>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {data.data.events.map((event) => {
                  const starts = new Date(event.startsAt);
                  return (
                    <Card as="li" key={event.slug}>
                      <div className="flex flex-col gap-1 p-4">
                        <Heading level={4} size="xl">
                          {event.title}
                        </Heading>
                        <p className="m-0 text-ink-soft">
                          {t("next", { date: formatEventDate(starts, locale), time: formatTimeRange(starts, new Date(event.endsAt), locale) })}
                        </p>
                        {event.venueName ? <p className="m-0 text-sm text-muted">{event.venueName}</p> : null}
                        <div className="pt-2">
                          <Button type="button" variant="secondary" size="sm" aria-label={t("detailsFor", { name: event.title })} onClick={() => hub.push({ action: "help", need, event: event.slug })}>
                            {t("details")}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </ul>
            </section>
          ) : null}
          {!data.data.services.length && !data.data.events.length ? (
            <Alert tone="info" title={t("noneTitle")}>
              <p className="m-0">{t("noneText", { phone: ORGANIZATION.phone.display })}</p>
            </Alert>
          ) : null}
        </>
      ) : null}
    </HubStep>
  );
}

function ServiceDetail({ need, slug }: { need?: HelpNeed; slug: string }) {
  const t = useTranslations("Hub.help");
  const e = useTranslations("Hub.event");
  const hub = useHub();
  const locale = useLocale();
  const data = useHubData<{ service: HelpService }>(`/api/hub/help/${slug}?lang=${hub.lang}`);
  const parent = need ? { action: "help" as const, need } : { action: "help" as const };
  const service = data.status === "ready" ? data.data.service : null;
  const phone = ORGANIZATION.phone;

  const start = service
    ? {
        call: (
          <a href={phone.href} className={buttonStyles({ variant: "primary" })}>
            {t("call", { phone: phone.display })}
          </a>
        ),
        apply: service.applyUrl ? (
          <a href={service.applyUrl} target="_blank" rel="noopener noreferrer" aria-label={t("applyNewTab")} className={buttonStyles({ variant: "primary" })}>
            {t("apply")}
          </a>
        ) : null,
        come: null,
        contact: (
          <>
            <a href={ORGANIZATION.email.href} className={buttonStyles({ variant: "secondary" })}>
              {t("email")}
            </a>
            <a href={phone.href} className={buttonStyles({ variant: "primary" })}>
              {t("call", { phone: phone.display })}
            </a>
          </>
        ),
      }[service.howToStart]
    : null;

  return (
    <HubStep label={t("door")} parent={parent} after={<EmergencyFooter />} actions={start}>
      {data.status === "loading" ? <HubLoading /> : null}
      {data.status === "error" ? <HubError onRetry={data.retry} /> : null}
      {data.status === "not-found" ? (
        <>
          <HubTitle>{t("notFound")}</HubTitle>
          <p className="m-0 text-ink-soft">{t("noneText", { phone: phone.display })}</p>
        </>
      ) : null}
      {service ? (
        <>
          <HubTitle intro={service.summary}>{service.name}</HubTitle>
          {service.howToStart === "come" ? <Alert tone="info">{t("justCome")}</Alert> : null}
          <dl className="m-0 flex flex-col gap-4">
            {(
              [
                [t("whoFor"), service.whoFor],
                [t("when"), service.when],
                [
                  t("where"),
                  service.address ? (
                    <>
                      {service.address}{" "}
                      <ExternalLink href={directionsUrl(service.address)} newTab>
                        {e("directions")}
                      </ExternalLink>
                    </>
                  ) : null,
                ],
                [t("bring"), service.bring],
                [t("cost"), service.cost],
                [t("languages"), languageNames(service.languages, locale)],
                [
                  t("questions"),
                  <a key="phone" href={phone.href} className="font-semibold text-ink underline">
                    {phone.display}
                  </a>,
                ],
              ] as [string, React.ReactNode][]
            )
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-sm font-semibold text-muted">{label}</dt>
                  <dd className="m-0 text-ink">{value}</dd>
                </div>
              ))}
          </dl>
        </>
      ) : null}
    </HubStep>
  );
}

function HelpEvent({ need, slug }: { need?: HelpNeed; slug: string }) {
  const t = useTranslations("Hub.help");
  const data = useHubEvent(slug);
  const parent = need ? { action: "help" as const, need } : { action: "help" as const };
  return (
    <HubStep label={t("door")} parent={parent} after={<EmergencyFooter />}>
      {data.status === "loading" ? <HubLoading /> : null}
      {data.status === "error" ? <HubError onRetry={data.retry} /> : null}
      {data.status === "not-found" ? <HubTitle>{t("notFound")}</HubTitle> : null}
      {data.status === "ready" ? <EventDetailsBody event={data.data.event} side="guest" fixedSide /> : null}
    </HubStep>
  );
}

/** Routes Get Help's URL state to its step. */
export function HelpFlow({ need, service, event }: { need?: HelpNeed; service?: string; event?: string }) {
  if (service) return <ServiceDetail need={need} slug={service} />;
  if (event) return <HelpEvent need={need} slug={event} />;
  if (need && need !== "other") return <HelpResults need={need} />;
  return <HelpLanding initial={need} />;
}
