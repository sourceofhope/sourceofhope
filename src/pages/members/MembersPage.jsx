// src/pages/members/MembersPage.jsx
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { CANONICAL_URL } from "../../routes";
import { useHeaderContext } from "../../context/HeaderContext";

import Title from "../../components/ui/text/Title";
import Heading from "../../components/ui/text/Heading";

import MembersHeroSection from "./sections/MembersHeroSection";
import MembersBenefitsSection from "./sections/MembersBenefitsSection";
import MembersPlansSection from "./sections/MembersPlansSection";
import MembersFAQSection from "./sections/MembersFAQSection";

export default function MembersPage() {
  const { setIsBlocking } = useHeaderContext();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);

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

      <section className="md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35">
        <div className="grid gap-1 justify-self-start justify-start">
          <Title>Monthly Impact</Title>
          <Heading>Support the mission with a consistent monthly gift.</Heading>
        </div>
      </section>

      <MembersHeroSection />
      <MembersBenefitsSection />
      <MembersPlansSection />
      <MembersFAQSection />
    </>
  );
}
