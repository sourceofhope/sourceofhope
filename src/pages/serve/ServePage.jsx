import { Helmet } from "react-helmet";

import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";
import ServeShowcaseSection from "./sections/ServeShowcaseSection";
import ServeProgramsSection from "./sections/ServeProgramsSection";
import ServeDonationSection from "./sections/ServeDonationSection";
import ServeGuidelinesSection from "./sections/ServeGuidelinesSection";
import ServeEventsSection from "./sections/ServeEventsSection";

export default function ServePage() {
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

        <link
          rel="preload"
          as="image"
          href={`/${ASSET_VERSION}/core/TSOH-Family.webp`}
          fetchPriority="high"
        />
      </Helmet>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-10925214570"></script>
      <script>
        window.dataLayer = window.dataLayer || []; function gtag()
        {dataLayer.push(arguments)}
        gtag('js', new Date()); gtag('config', 'AW-10925214570');
      </script>
      <PageHeader>
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
      <ServeEventsSection />
      <ServeGuidelinesSection />
    </>
  );
}
