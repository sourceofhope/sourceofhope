import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import MembersHeroSection from "@/components/members/MembersHeroSection";
import MembersBenefitsSection from "@/components/members/MembersBenefitsSection";
import MembersPlansSection from "@/components/members/MembersPlansSection";
import MembersFAQSection from "@/components/members/MembersFAQSection";
import { ASSET_VERSION } from "@/lib/environment";

const CANONICAL_URL = "https://thesourceofhope.org/members";

export const metadata: Metadata = {
  title: "Monthly Impact | The Source of Hope",
  description:
    "Support The Source of Hope with a monthly gift. Choose an individual monthly impact level or a company partnership to help sustain meals, wellness care, education, and outreach in DFW.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Monthly Impact | The Source of Hope",
    description:
      "Become a monthly supporter or a company partner to help sustain meals, wellness care, education, and outreach in DFW.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monthly Impact | The Source of Hope",
    description:
      "Choose an individual monthly impact level or a company partnership to sustain programs across DFW.",
  },
};

export default function Members() {
  return (
    <>
      <PageHeader
        src={`/${ASSET_VERSION}/core/TSOH-Family.webp`}
        title="MEMBERSHIPS"
        subtitle="CONSISTENT SUPPORT FOR THE MISSION"
      />

      <MembersHeroSection />
      <MembersBenefitsSection />
      <MembersPlansSection />
      <MembersFAQSection />
    </>
  );
}
