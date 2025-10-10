import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";
import PageSection from "../PageSection";

import AboutDescriptionSection from "./sections/AboutDescriptionSection";
import AboutMissionSection from "./sections/AboutMissionSection";
import AboutSummarySection from "./sections/AboutSummarySection";
import AboutTeamSection from "./sections/AboutTeamSection";

import { Helmet } from "react-helmet";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About | The Source of Hope</title>
        <meta
          name="description"
          content="Learn about The Source of Hope’s mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth."
        />
        <link rel="canonical" href={CANONICAL_URL.about} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.about} />
        <meta property="og:title" content="About | The Source of Hope" />
        <meta
          property="og:description"
          content="Learn about The Source of Hope’s mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.about} />
        <meta name="twitter:title" content="About | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Learn about The Source of Hope’s mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth."
        />
      </Helmet>
      <PageHeader src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344">
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          ABOUT
        </h2>
        <p className="font-semibold text-neutral-200 text-sm pb-10">
          EMPOWERING COMMUNITIES THROUGH DIGNITY, WELLNESS, AND COMPASSION
        </p>
      </PageHeader>
      <AboutDescriptionSection />
      <AboutMissionSection />
      <AboutSummarySection />
      <AboutTeamSection />
    </>
  );
}