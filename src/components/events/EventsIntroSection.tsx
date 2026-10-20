import {
  CalendarDaysIcon,
  DocumentCheckIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";

const EVENTBRITE_URL = "https://www.eventbrite.com/o/quynh-chau-stone-92264017613";

const STEPS = [
  {
    icon: CalendarDaysIcon,
    title: "Find an event",
    text: "Browse our featured events and monthly programs below, then open any event for the full details.",
  },
  {
    icon: DocumentCheckIcon,
    title: "Sign your waiver once",
    text: "Volunteers sign a one-time agreement, online or on paper. It covers every Source of Hope event.",
  },
  {
    icon: TicketIcon,
    title: "Register and join us",
    text: "Reserve your spot through the event's registration page, and we'll see you there.",
  },
];

export default function EventsIntroSection() {
  return (
    <PageSection className="py-10 text-sm md:text-md lg:text-lg">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <SectionHeading eyebrow="Get involved" title="Gather, serve, and celebrate with us">
          Our events come in two kinds. <strong>Featured events</strong> are our
          signature gatherings each year, where the whole community comes
          together to raise support and celebrate what hope makes possible.{" "}
          <strong>Monthly programs</strong> are the steady heartbeat of our
          work: regular chances to serve meals, mentor students, and support
          wellness for families across Dallas–Fort Worth.
        </SectionHeading>

        <ol className="grid gap-4">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-2xl bg-neutral-100 p-5 shadow-sm">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-500 text-neutral-50">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="grid gap-1">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-700">
                  Step {index + 1}
                </span>
                <span className="font-semibold text-primary-800">{title}</span>
                <span className="text-sm text-neutral-600">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-sm text-neutral-600">
        All upcoming registrations are also listed on{" "}
        <a
          className="font-semibold text-accent-600"
          href={EVENTBRITE_URL}
          target="_blank"
          rel="noopener noreferrer">
          our Eventbrite page
        </a>
        .
      </p>
    </PageSection>
  );
}
