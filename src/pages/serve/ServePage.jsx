import { Helmet } from "react-helmet";

import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";
import ServeShowcaseSection from "./sections/ServeShowcaseSection";
import ServeProgramsSection from "./sections/ServeProgramsSection";
import ServeDonationSection from "./sections/ServeDonationSection";
import ServeGuidelinesSection from "./sections/ServeGuidlinesSection";

export default function SavePage() {
  return (
    <>
      <Helmet>
        <title>Serve | The Source of Hope</title>
        <meta
          name="description"
          content="Volunteer with The Source of Hope to prepare, cook, and serve meals to homeless and low-income families across Dallas–Fort Worth every month."
        />
        <link rel="canonical" href={CANONICAL_URL.serve} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.serve} />
        <meta property="og:title" content="Serve | The Source of Hope" />
        <meta
          property="og:description"
          content="Volunteer with The Source of Hope to prepare, cook, and serve meals to homeless and low-income families across Dallas–Fort Worth every month."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.serve} />
        <meta name="twitter:title" content="Serve | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Volunteer with The Source of Hope to prepare, cook, and serve meals to homeless and low-income families across Dallas–Fort Worth every month."
        />
      </Helmet>
      <PageHeader src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344">
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          SERVE
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          MAKE AN IMPACT IN YOUR COMMUNITY
        </p>
      </PageHeader>
      <ServeShowcaseSection />
      <ServeProgramsSection />
      <ServeDonationSection />
      <ServeGuidelinesSection />
    </>
  );
}
