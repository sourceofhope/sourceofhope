import { Metadata } from "next";
import { HeartIcon } from "@heroicons/react/24/solid";
import PageHeader from "@/components/layout/PageHeader";
import CallToActionSection from "@/components/ui/CallToActionSection";
import MembersHeroSection from "@/components/members/MembersHeroSection";
import MembersCircleSection from "@/components/members/MembersCircleSection";
import MembersBenefitsSection from "@/components/members/MembersBenefitsSection";
import MembersPlansSection from "@/components/members/MembersPlansSection";
import MembersPartnersSection from "@/components/members/MembersPartnersSection";
import MembersInquirySection from "@/components/members/MembersInquirySection";
import MembersFAQSection from "@/components/members/MembersFAQSection";
import { ASSET_VERSION } from "@/lib/environment";
import {
  FOUNDING_SPONSOR_DEADLINE_LABEL,
  isFoundingSponsorWindowOpen,
} from "@/lib/sponsor-launch";

const CANONICAL_URL = "https://thesourceofhope.org/members";

// Re-render hourly so the Thanksgiving launch messaging retires on its own.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Community Sponsors | The Source of Hope",
  description:
    "Become a Community Sponsor of The Source of Hope. Local businesses and neighbors give monthly to sustain meals, wellness care, and education across DFW, and support local businesses that give back.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Community Sponsors | The Source of Hope",
    description:
      "Local business. Lasting hope. Sponsor meals, wellness care, and education in DFW every month, and meet the local businesses that give back.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Sponsors | The Source of Hope",
    description:
      "Local business. Lasting hope. Become a monthly Community Sponsor and help families across DFW gather around the table.",
  },
};

export default function Members() {
  const launchOpen = isFoundingSponsorWindowOpen();

  return (
    <>
      <PageHeader
        src={`/${ASSET_VERSION}/serve/SH-Banner2.webp`}
        title="COMMUNITY SPONSORS"
        subtitle="LOCAL BUSINESS. LASTING HOPE."
      />

      <MembersHeroSection launchOpen={launchOpen} />
      <MembersCircleSection />
      <MembersBenefitsSection />
      <MembersPlansSection />
      <MembersPartnersSection />
      <MembersInquirySection />
      <MembersFAQSection />

      {launchOpen ? (
        <CallToActionSection
          icon={HeartIcon}
          title="Pull up a chair this Thanksgiving"
          href="#plans"
          buttonText="BECOME A FOUNDING SPONSOR">
          Join by {FOUNDING_SPONSOR_DEADLINE_LABEL} to be recognized as a
          Founding Sponsor and help families across DFW gather around the table
          this season.
        </CallToActionSection>
      ) : (
        <CallToActionSection
          icon={HeartIcon}
          title="Every table needs a sponsor"
          href="#plans"
          buttonText="BECOME A SPONSOR">
          Monthly sponsors keep meals, wellness care, and education going for
          families across DFW all year long.
        </CallToActionSection>
      )}
    </>
  );
}
