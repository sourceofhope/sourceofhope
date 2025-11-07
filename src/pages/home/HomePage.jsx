import ExpressiveLink from "../../components/ui/expressive/ExpressiveLink";

import HomeImpactSection from "./sections/HomeImpactSection";
import HomeIntroductionSection from "./sections/HomeIntroductionSection";
import HomeMissionSection from "./sections/HomeMissionSection";
import HomeResourcesSection from "./sections/HomeResourcesSection";
import HomePublicationsSection from "./sections/HomePublicationsSection";

import HomeDonationSection from "./sections/HomeDonationSection";
import { HomeServingSection } from "./sections/HomeServingSection";
import { Helmet } from "react-helmet";
import { CANONICAL_URL } from "../../routes";
import PageSection from "../PageSection";
import Title from "../../components/ui/text/Title";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | The Source of Hope</title>
        <meta
          name="description"
          content="The Source of Hope is a nonprofit organization providing food, education, and holistic wellness to individuals and families across the DFW area."
        />
        <link rel="canonical" href={CANONICAL_URL.home} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.home} />
        <meta property="og:title" content="Home | The Source of Hope" />
        <meta
          property="og:description"
          content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.home} />
        <meta name="twitter:title" content="Home | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
        />
      </Helmet>
      <HomeIntroductionSection />
      <HomeMissionSection />
      <HomeImpactSection />
      <HomeResourcesSection />
      <HomeServingSection />
      <HomeDonationSection />
      <HomePublicationsSection />
    </>
  );
}

export function HomeSection({ title, className, children, caption, to }) {
  return (
    <PageSection>
      {title ? (
        <Title className="text-xlg lg:text-xxlg text-balance font-urbanist justify-self-center">
          {title}
        </Title>
      ) : (
        <></>
      )}
      <div className={className}>{children}</div>
      {caption ? (
        <button className="justify-self-end w-fit text-neutral-600">
          <ExpressiveLink className="text-sm" to={to}>
            {caption}
          </ExpressiveLink>
        </button>
      ) : (
        <></>
      )}
    </PageSection>
  );
}

export function HomeContent({ className, children }) {
  return (
    <section
      className={`w-full md:justify-items-left items-center grid ${className}`}>
      {children}
    </section>
  );
}
