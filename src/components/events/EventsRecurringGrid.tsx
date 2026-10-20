import { ArrowRightIcon, CalendarDaysIcon, MapPinIcon } from "@heroicons/react/20/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import EventTrigger from "@/components/events/EventTrigger";
import type { EventView } from "@/lib/event-view";

/** Monthly programs as cards; each opens the details modal. */
export default function EventsRecurringGrid({ events }: { events: EventView[] }) {
  return (
    <PageSection
      id="monthly-programs"
      className="bg-neutral-200 py-12 text-sm md:text-md lg:text-lg">
      <SectionHeading eyebrow="Monthly programs" title="Ways to serve every month">
        These programs run on a regular schedule, so there is always a next
        chance to lend a hand. Select a program for times, location, and
        registration.
      </SectionHeading>

      {events.length === 0 ? (
        <p className="rounded-2xl bg-neutral-50 p-6 text-center text-neutral-600">
          Monthly program dates will be posted soon.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.key}>
              <EventTrigger
                eventKey={event.key}
                label={`View details for ${event.title}`}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-neutral-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
                <span className="relative block aspect-video bg-primary-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full ${
                      event.image.isPlaceholder ? "object-cover" : "object-contain"
                    }`}
                  />
                </span>
                <span className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-lg font-bold leading-snug text-primary-800">
                    {event.title}
                  </span>
                  <span className="grid gap-1 text-sm text-neutral-600">
                    {(event.schedule || (event.isUpcoming && event.shortDate)) && (
                      <span className="inline-flex items-start gap-1">
                        <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-accent-600" aria-hidden="true" />
                        {event.schedule ?? `Next: ${event.shortDate}`}
                      </span>
                    )}
                    {event.location && (
                      <span className="inline-flex items-start gap-1">
                        <MapPinIcon className="mt-0.5 size-4 shrink-0 text-accent-600" aria-hidden="true" />
                        {event.location}
                      </span>
                    )}
                  </span>
                  {event.summary && (
                    <span className="line-clamp-3 text-sm text-neutral-700">{event.summary}</span>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-accent-600">
                    View details
                    <ArrowRightIcon
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </EventTrigger>
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  );
}
