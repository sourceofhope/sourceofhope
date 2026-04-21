import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ServeShowcaseSection from "@/components/serve/ServeShowcaseSection";
import ServeProgramsSection from "@/components/serve/ServeProgramsSection";
import ServeDonationSection from "@/components/serve/ServeDonationSection";
import ServeEventsSection from "@/components/serve/ServeEventsSection";
import ServeGuidelinesSection from "@/components/serve/ServeGuidelinesSection";

export const metadata: Metadata = {
  title: "Serve | The Source of Hope",
  description:
    "Volunteer with The Source of Hope to prepare, cook, and serve meals to homeless and low-income families across Dallas–Fort Worth every month.",
};

export default function Serve() {
  return (
    <>
      <PageHeader>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          SERVE
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          MAKE AN IMPACT IN YOUR COMMUNITY
        </p>
      </PageHeader>
      <ServeShowcaseSection />
      <ServeEventsSection />
      <ServeProgramsSection />
      <ServeDonationSection />
      <ServeGuidelinesSection />
    </>
  );
}
