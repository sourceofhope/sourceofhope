import { Suspense } from "react";
import { Metadata } from "next";
import { HeartIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/layout/PageHeader";
import CallToActionSection from "@/components/ui/CallToActionSection";
import EventsIntroSection from "@/components/events/EventsIntroSection";
import EventsTimeline from "@/components/events/EventsTimeline";
import EventsRecurringGrid from "@/components/events/EventsRecurringGrid";
import EventsDocumentsSection from "@/components/events/EventsDocumentsSection";
import EventModalController from "@/components/events/EventModalController";
import {
  fetchRecurringEvents,
  fetchTimelineEvents,
  type SanityEvent,
} from "@/lib/sanity-content";
import { sortRecurringEvents, toEventView } from "@/lib/event-view";
import { ASSET_VERSION } from "@/lib/environment";

const DESCRIPTION =
  "Join The Source of Hope at our featured community events and monthly volunteer programs serving meals, mentoring students, and supporting wellness across Dallas–Fort Worth.";

export const metadata: Metadata = {
  title: "Events | The Source of Hope",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: "Events | The Source of Hope",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | The Source of Hope",
    description:
      "Featured events and monthly volunteer programs sharing hope across DFW.",
  },
};

// Fall back to the empty states if the CMS is unreachable.
async function getEvents(): Promise<[SanityEvent[], SanityEvent[]]> {
  try {
    return await Promise.all([fetchTimelineEvents(12), fetchRecurringEvents(12)]);
  } catch {
    return [[], []];
  }
}

export default async function EventsPage() {
  const [featured, recurring] = await getEvents();
  const timeline = featured.map((event) => toEventView(event, "featured"));
  const monthly = sortRecurringEvents(recurring).map((event) =>
    toEventView(event, "recurring"),
  );

  return (
    <>
      <PageHeader
        src={`/${ASSET_VERSION}/hope-run-for-hunger-2025.webp`}
        title="EVENTS"
        subtitle="JOIN US IN MAKING A DIFFERENCE"
      />
      <EventsIntroSection />
      <EventsTimeline events={timeline} />
      <EventsRecurringGrid events={monthly} />
      <EventsDocumentsSection />
      <CallToActionSection
        icon={HeartIcon}
        title="Can't make it to an event?"
        href="/programs"
        buttonText="EXPLORE OUR PROGRAMS">
        There are many ways to share hope. Explore our programs to find the
        right fit, or reach out and we&apos;ll help you get involved.
      </CallToActionSection>

      {/* Opens the details modal for ?event=; in Suspense so the rest of the page stays static. */}
      <Suspense fallback={null}>
        <EventModalController events={[...timeline, ...monthly]} />
      </Suspense>
    </>
  );
}
