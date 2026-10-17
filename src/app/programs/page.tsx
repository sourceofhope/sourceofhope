import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ProgramsShowcaseSection from "@/components/programs/ProgramsShowcaseSection";
import ProgramsListSection from "@/components/programs/ProgramsListSection";
import ProgramsDonationSection from "@/components/programs/ProgramsDonationSection";
import ProgramsGuidelinesSection from "@/components/programs/ProgramsGuidelinesSection";

export const metadata: Metadata = {
  title: "Programs | The Source of Hope",
  description:
    "Explore The Source of Hope's programs and volunteer to serve meals, mentor students, and support wellness for families across Dallas–Fort Worth.",
};

export default function Programs() {
  return (
    <>
      <PageHeader title="PROGRAMS" subtitle="MAKE AN IMPACT IN YOUR COMMUNITY" />
      <ProgramsShowcaseSection />
      <ProgramsListSection />
      <ProgramsDonationSection />
      <ProgramsGuidelinesSection />
    </>
  );
}
