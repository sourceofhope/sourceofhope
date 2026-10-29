import type { SanityEvent } from "@/lib/sanity-content";
import { formatLongDate, formatShortDate, formatTimeRange, getDateParts, type DateParts } from "@/lib/format-date";
import { ASSET_VERSION } from "@/lib/environment";

/**
 * Display-ready event data. Built on the server (dates already formatted in
 * Central time) and passed to client components as plain props.
 */
export interface EventView {
  key: string;
  kind: "featured" | "recurring";
  title: string;
  summary?: string;
  description?: string;
  location?: string;
  address?: string;
  mapUrl?: string;
  program?: string;
  programLabel?: string;
  schedule?: string;
  registerUrl?: string;
  /** Featured events only; recurring events are never "completed". */
  isCompleted: boolean;
  /** The listed date is still ahead (for recurring events: the next date). */
  isUpcoming: boolean;
  longDate?: string;
  shortDate?: string;
  timeRange?: string;
  dateParts?: DateParts;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    isPlaceholder: boolean;
  };
}

export const PROGRAM_LABELS: Record<string, { label: string; href: string }> = {
  servingHope: { label: "Serving & Sharing Hope", href: "/programs/servingHope" },
  educationHope: { label: "Education for Hope", href: "/programs/educationHope" },
  wellnessHope: { label: "Wellness of Hope", href: "/programs/wellnessHope" },
  outdoorHope: { label: "Hope for the Outdoors", href: "/programs/outdoorHope" },
  internationalHope: { label: "Hope Beyond Borders", href: "/programs/internationalHope" },
};

function safeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function toEventView(event: SanityEvent, kind: EventView["kind"]): EventView {
  const isUpcoming = Boolean(event.date) && !event.isOutdated;
  const address = event.address?.trim() || undefined;

  return {
    key: event.key,
    kind,
    title: event.title,
    summary: event.summary?.trim() || undefined,
    description: event.description?.trim() || undefined,
    location: event.location?.trim() || undefined,
    address,
    mapUrl: address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : undefined,
    program: event.program,
    programLabel: event.program ? PROGRAM_LABELS[event.program]?.label : undefined,
    schedule: event.schedule?.trim() || undefined,
    registerUrl: safeUrl(event.eventPage?.url),
    isCompleted: kind === "featured" && Boolean(event.isOutdated),
    isUpcoming,
    longDate: formatLongDate(event.date),
    shortDate: formatShortDate(event.date),
    timeRange: formatTimeRange(event.date, event.endDate),
    dateParts: getDateParts(event.date),
    image: event.image?.sourceUrl
      ? {
          src: event.image.sourceUrl,
          alt: event.image.altText || event.title,
          width: event.image.width,
          height: event.image.height,
          isPlaceholder: false,
        }
      : {
          src: `/${ASSET_VERSION}/core/placeholder.webp`,
          alt: "",
          isPlaceholder: true,
        },
  };
}
