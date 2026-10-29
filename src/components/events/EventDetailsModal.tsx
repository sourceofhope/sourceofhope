"use client";

import Link from "next/link";
import {
  ArrowDownTrayIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { VOLUNTEER_DOCUMENTS } from "@/components/events/EventsDocumentsSection";
import { PROGRAM_LABELS, type EventView } from "@/lib/event-view";

interface EventDetailsModalProps {
  event: EventView;
  titleId: string;
}

function registerLabel(url: string) {
  try {
    return new URL(url).hostname.includes("eventbrite") ? "Register on Eventbrite" : "Register";
  } catch {
    return "Register";
  }
}

/** Details on the left, image on the right (stacked on small screens). */
export default function EventDetailsModal({ event, titleId }: EventDetailsModalProps) {
  const program = event.program ? PROGRAM_LABELS[event.program] : undefined;
  const body = event.description || event.summary;

  return (
    <article className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="order-2 grid grid-cols-1 content-start gap-6 p-6 md:order-1 md:p-10">
        <header className="grid gap-3 pr-10 md:pr-0">
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest">
            <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-700">
              {event.kind === "featured" ? "Featured event" : "Monthly program"}
            </span>
            {program && (
              <Link
                href={program.href}
                className="no-underline! rounded-full bg-accent-50 px-3 py-1 text-accent-700 hover:bg-accent-100">
                {program.label}
              </Link>
            )}
            {event.isCompleted && (
              <span className="rounded-full bg-neutral-200 px-3 py-1 text-neutral-700">
                Completed
              </span>
            )}
          </div>
          <h2
            id={titleId}
            className="font-urbanist text-xlg font-bold leading-tight text-primary-800 md:text-xxlg text-balance">
            {event.title}
          </h2>
        </header>

        <dl className="grid gap-3 text-sm md:text-md">
          {event.kind === "recurring" && event.schedule && (
            <Fact icon={CalendarDaysIcon} label="Schedule">
              {event.schedule}
            </Fact>
          )}
          {event.longDate && (event.kind === "featured" || event.isUpcoming) && (
            <Fact
              icon={event.kind === "recurring" ? ClockIcon : CalendarDaysIcon}
              label={event.kind === "recurring" ? "Next date" : "Date"}>
              {event.longDate}
              {event.timeRange && (
                <span className="block text-neutral-600">{event.timeRange} Central</span>
              )}
            </Fact>
          )}
          {(event.location || event.address) && (
            <Fact icon={MapPinIcon} label="Location">
              {event.location && <span className="block">{event.location}</span>}
              {event.address && (
                <span className="block text-neutral-600">{event.address}</span>
              )}
              {event.mapUrl && (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 font-semibold text-accent-600">
                  Get directions
                  <ArrowUpRightIcon className="size-4" aria-hidden="true" />
                </a>
              )}
            </Fact>
          )}
        </dl>

        {body && (
          <p className="whitespace-pre-line leading-relaxed text-neutral-700">{body}</p>
        )}

        {!event.isCompleted && (
          <section
            aria-labelledby="volunteer-reminder-title"
            className="grid gap-3 rounded-2xl border border-neutral-300 p-5">
            <div className="flex items-start gap-3">
              <DocumentTextIcon className="size-7 shrink-0 text-accent-600" aria-hidden="true" />
              <div className="grid gap-1">
                <h3 id="volunteer-reminder-title" className="font-semibold text-primary-800">
                  Volunteering? Please sign the agreement first
                </h3>
                <p className="text-sm text-neutral-600">
                  Download the Volunteer Agreement, sign it, and email it to{" "}
                  <a
                    className="font-semibold text-accent-600 break-words"
                    href="mailto:info@thesourceofhope.org?subject=Signed%20Volunteer%20Agreement">
                    info@thesourceofhope.org
                  </a>{" "}
                  before you register. You only need to sign it once.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pl-10 text-sm">
              {VOLUNTEER_DOCUMENTS.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.href}
                  download
                  className="no-underline! inline-flex items-center gap-2 font-semibold text-accent-700 hover:text-accent-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 rounded">
                  <ArrowDownTrayIcon className="size-4" aria-hidden="true" />
                  {doc.title}
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className="flex flex-wrap items-center gap-3">
          {event.isCompleted && (
            <p className="text-neutral-600">
              This event has ended. Thank you to everyone who joined us!
            </p>
          )}
          {event.registerUrl ? (
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline! group inline-flex items-center gap-3 rounded-2xl bg-accent-500 px-8 py-4 font-semibold text-neutral-50 transition-colors hover:bg-accent-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-300">
              {registerLabel(event.registerUrl)}
              <ArrowUpRightIcon
                className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          ) : (
            !event.isCompleted && (
            <p className="text-neutral-600">
              Registration opens soon. Check back, or email{" "}
              <a className="font-semibold text-accent-600" href="mailto:info@thesourceofhope.org">
                info@thesourceofhope.org
              </a>
              .
            </p>
            )
          )}
        </footer>
      </div>

      <div className="relative order-1 min-h-64 overflow-hidden bg-primary-900 md:order-2 md:min-h-full">
        {!event.image.isPlaceholder && (
          // Blurred copy fills the frame behind flyers that don't match its shape.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.image.src}
          alt={event.image.alt}
          width={event.image.width}
          height={event.image.height}
          decoding="async"
          className={`relative h-full max-h-[50vh] w-full md:absolute md:inset-0 md:max-h-none ${
            event.image.isPlaceholder ? "object-cover" : "object-contain"
          }`}
        />
      </div>
    </article>
  );
}

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDaysIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-accent-600" aria-hidden="true" />
      <div>
        <dt className="text-xs font-bold uppercase tracking-widest text-neutral-500">{label}</dt>
        <dd className="text-neutral-900">{children}</dd>
      </div>
    </div>
  );
}
