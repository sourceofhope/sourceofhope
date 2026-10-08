import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ServeEventsSection from "@/components/serve/ServeEventsSection";

export const metadata: Metadata = {
  title: "Events | The Source of Hope",
  description:
    "Explore The Source of Hope events hub featuring events highlighting our mission and community impact across Dallas–Fort Worth.",
  openGraph: {
    type: "website",
    title: "Events | The Source of Hope",
    description:
      "Watch and explore events sharing the heart and impact of The Source of Hope.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | The Source of Hope",
    description:
      "Upcoming and Recurring Events sharing hope, healing, and community impact across DFW.",
  },

};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        src="/v2/hope-run-for-hunger-2025.webp"
        title="EVENTS"
        subtitle="JOIN US IN MAKING A DIFFERENCE"
      />

      <ServeEventsSection />
    </>
  );
 }
