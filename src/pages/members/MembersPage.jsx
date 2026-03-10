import { Helmet } from "react-helmet-async";
import { ASSET_VERSION, CANONICAL_URL } from "../../routes";

import MembersHeroSection from "./sections/MembersHeroSection";
import MembersBenefitsSection from "./sections/MembersBenefitsSection";
import MembersPlansSection from "./sections/MembersPlansSection";
import MembersFAQSection from "./sections/MembersFAQSection";
import PageHeader from "../PageHeader";

export default function MembersPage() {
  return (
    <>
      <Helmet>
        <title>Monthly Impact | The Source of Hope</title>
        <meta
          name="description"
          content="Support The Source of Hope with a monthly gift. Choose an individual monthly impact level or a company partnership to help sustain meals, wellness care, education, and outreach in DFW."
        />
        <link rel="canonical" href={CANONICAL_URL.member} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.member} />
        <meta
          property="og:title"
          content="Monthly Impact | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Become a monthly supporter or a company partner to help sustain meals, wellness care, education, and outreach in DFW."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.member} />
        <meta
          name="twitter:title"
          content="Monthly Impact | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Choose an individual monthly impact level or a company partnership to sustain programs across DFW."
        />
      </Helmet>

      <PageHeader src={`/${ASSET_VERSION}/core/TSOH-Family.webp`}>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          MEMBERSHIPS
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          CONSISTENT SUPPORT FOR THE MISSION
        </p>
      </PageHeader>

      <MembersHeroSection />
      <MembersBenefitsSection />
      <MembersPlansSection />
      <MembersFAQSection />
    </>
  );
}
