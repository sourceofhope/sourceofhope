import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ServeShowcaseSection from "@/components/serve/ServeShowcaseSection";
import ServeProgramsSection from "@/components/serve/ServeProgramsSection";
import ServeDonationSection from "@/components/serve/ServeDonationSection";
import ServeEventsSection from "@/components/serve/ServeEventsSection";
import ServeGuidelinesSection from "@/components/serve/ServeGuidelinesSection";
import ServeAgreementsSection from "@/components/serve/ServeAgreementsSection";

export const metadata: Metadata = {
  title: "Serve | The Source of Hope",
  description:
    "Volunteer with The Source of Hope to prepare, cook, and serve meals to homeless and low-income families across Dallas–Fort Worth every month.",
};

export default function Serve() {
  return (
    <>
      <PageHeader
        title="SERVE"
        subtitle="MAKE AN IMPACT IN YOUR COMMUNITY"
      />
      <ServeShowcaseSection />
      <ServeEventsSection />
      <ServeProgramsSection />
      <ServeDonationSection />
      <ServeGuidelinesSection />
      <ServeAgreementsSection />
    </>
  );
}
