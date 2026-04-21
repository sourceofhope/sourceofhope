import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import AboutDescriptionSection from "@/components/about/AboutDescriptionSection";
import AboutMissionSection from "@/components/about/AboutMissionSection";
import AboutSummarySection from "@/components/about/AboutSummarySection";

export const metadata: Metadata = {
  title: "About | The Source of Hope",
  description:
    "Learn about The Source of Hope's mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth.",
  openGraph: {
    title: "About | The Source of Hope",
    description:
      "Learn about The Source of Hope's mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth.",
  },
  twitter: {
    title: "About | The Source of Hope",
    description:
      "Learn about The Source of Hope's mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth.",
  },
};

export default function About() {
  return (
    <>
      <PageHeader>
        <h1 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          ABOUT
        </h1>
        <p className="font-semibold text-neutral-200 text-sm">
          EMPOWERING COMMUNITIES
        </p>
      </PageHeader>
      <AboutDescriptionSection />
      <AboutMissionSection />
      <AboutSummarySection />
    </>
  );
}
