import { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";


// import Title from "@/components/ui/Title";
// import Heading from "@/components/ui/Heading";
// import { AnchorButton } from "@/components/ui/Button";
// import Carousel from "@/components/ui/Carousel";
// import Icon from "@/components/ui/Icon";
// import Bold from "@/components/ui/Bold";
// import HighlightedText from "@/components/ui/HighlightedText";
// import {
//   HeartIcon,
//   UserIcon,
//   AcademicCapIcon,
//   GlobeAmericasIcon,
// } from "@heroicons/react/20/solid";
// import Block from "@/components/layout/Block";
// import { ASSET_VERSION } from "@/lib/environment";
//added the following import on 07/02/26 for display of Recurring Events 
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
      <PageHeader src="/v2/hope-run-for-hunger-2025.webp">
        <h2 className="font-bold text-neutral-50 text-4xl md:text-5xl">
          EVENTS
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          JOIN US IN MAKING A DIFFERENCE
        </p>
      </PageHeader>

      <ServeEventsSection />
    </>
  );
 }
