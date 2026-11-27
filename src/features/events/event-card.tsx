import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import type { PublicEvent } from "@/lib/db/public-events";
import type { ContentImage } from "@/lib/content/image";
import { formatEventDate, formatTimeRange } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import { EventDetailsLink } from "./event-details-link";

export type EventCardProps = {
  event: PublicEvent;
  image: ContentImage;
  /** h2 in a flat list, h3 under a section or month heading (spec §7). */
  level?: 2 | 3;
};

/**
 * EventCard: one event in a grid (Home, Events, Program pages). The whole
 * card opens the event's details in the Hub (`?event=slug`, spec §9.4).
 */
export function EventCard({ event, image, level = 3 }: EventCardProps) {
  const t = useTranslations("Events");
  const locale = useLocale() as AppLocale;
  const starts = new Date(event.startsAt);
  const ends = new Date(event.endsAt);
  return (
    <Card as="li" interactive>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-video w-full object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap gap-1.5">
          {event.ownership === "partner" ? <Badge tone="neutral">{t("badges.partner")}</Badge> : null}
          {event.hasGuestInfo ? <Badge tone="public">{t("badges.public")}</Badge> : null}
          {event.hasVolunteerInfo ? <Badge tone="volunteer">{t("badges.volunteer")}</Badge> : null}
        </div>
        <Heading level={level} size="xl">
          <EventDetailsLink slug={event.slug}>{event.text.title}</EventDetailsLink>
        </Heading>
        <p className="text-muted">
          <time dateTime={event.startsAt}>{t("at", { date: formatEventDate(starts, locale), time: formatTimeRange(starts, ends, locale) })}</time>
        </p>
        {event.venueName ? <p className="text-sm text-muted">{event.venueName}</p> : null}
      </div>
    </Card>
  );
}
