import { ArrowRightIcon, MapPinIcon } from "@heroicons/react/20/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import EventTrigger from "@/components/events/EventTrigger";
import type { EventView } from "@/lib/event-view";

/**
 * Featured events as a vertical timeline: upcoming events in date order, then
 * the most recent completed ones. The server already limits and orders both
 * lists. Items open the details modal.
 */
export default function EventsTimeline({ events }: { events: EventView[] }) {
  const upcoming = events.filter((event) => !event.isCompleted);
  const past = events.filter((event) => event.isCompleted);

  return (
    <PageSection id="featured-events" className="py-10 text-sm md:text-md lg:text-lg">
      <SectionHeading eyebrow="Featured events" title="Our signature gatherings">
        A handful of special days each year bring our whole community together.
        Select an event to see the details and register.
      </SectionHeading>

      {events.length === 0 ? (
        <p className="rounded-2xl bg-neutral-100 p-6 text-center text-neutral-600">
          No featured events are scheduled right now. Check back soon, or join
          one of our monthly programs below.
        </p>
      ) : (
        <div className="grid gap-12">
          {upcoming.length > 0 ? (
            <TimelineGroup title="Coming up" events={upcoming} />
          ) : (
            <p className="rounded-2xl bg-neutral-100 p-6 text-neutral-600">
              Our next featured event will be announced soon.
            </p>
          )}
          {past.length > 0 && (
            <TimelineGroup title="Recently completed" events={past} completed />
          )}
        </div>
      )}
    </PageSection>
  );
}

function TimelineGroup({
  title,
  events,
  completed = false,
}: {
  title: string;
  events: EventView[];
  completed?: boolean;
}) {
  return (
    <section aria-label={title} className="grid gap-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 md:ml-28">
        {title}
      </h3>
      <ol className="relative grid max-w-4xl gap-8 border-l-2 border-neutral-300 ml-2 md:ml-28">
        {events.map((event) => (
          <li key={event.key} className="relative pl-6 md:pl-8">
            <span
              aria-hidden="true"
              className="absolute -left-[9px] top-5 size-4 rounded-full border-2 border-accent-500 bg-accent-500 ring-4 ring-accent-200"
            />
            {event.dateParts && (
              <p className="mb-2 font-urbanist font-semibold text-primary-800 md:absolute md:-left-28 md:top-2 md:mb-0 md:w-20 md:text-right">
                <span className="text-xs font-bold tracking-widest text-accent-700 md:block">
                  {event.dateParts.month}{" "}
                </span>
                <span className="text-xlg leading-none md:block md:text-xxlg">
                  {event.dateParts.day}
                </span>
                <span className="text-xs text-neutral-500 md:block"> {event.dateParts.year}</span>
              </p>
            )}
            <EventTrigger
              eventKey={event.key}
              label={`View details for ${event.title}`}
              className="group block w-full overflow-hidden rounded-2xl bg-neutral-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
              <span className="grid sm:grid-cols-[minmax(0,1fr)_11rem]">
                <span className="grid content-start gap-2 p-5">
                  <span className="text-lg font-bold leading-snug text-primary-800 md:text-xlg">
                    {event.title}
                  </span>
                  <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
                    {event.timeRange && <span>{event.timeRange}</span>}
                    {event.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPinIcon className="size-4 text-accent-600" aria-hidden="true" />
                        {event.location}
                      </span>
                    )}
                  </span>
                  {event.summary && (
                    <span className="line-clamp-2 text-sm text-neutral-700">{event.summary}</span>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                    {completed ? "View recap" : "View details"}
                    <ArrowRightIcon
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span className="relative hidden bg-primary-900 sm:block">
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
              </span>
            </EventTrigger>
          </li>
        ))}
      </ol>
    </section>
  );
}
