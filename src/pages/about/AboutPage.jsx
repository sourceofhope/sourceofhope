import PageHeader from "../PageHeader";
import PageSection from "../PageSection";

import AboutDescriptionSection from "./sections/AboutDescriptionSection";
import AboutMissionSection from "./sections/AboutMissionSection";
import AboutSummarySection from "./sections/AboutSummarySection";
import AboutTeamSection from "./sections/AboutTeamSection";

export default function AboutPage() {
  return (
    <>
      <PageHeader src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344">
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxlg md:text-xxxlg">
          ABOUT
        </h2>
        <p className="font-semibold text-neutral-300 text-sm pb-10">
          EMPOWERING COMMUNITIES THROUGH DIGNITY, WELLNESS, AND COMPASSION SINCE
          2014
        </p>
      </PageHeader>
      <AboutDescriptionSection />
      <AboutMissionSection />
      <AboutSummarySection />
      <AboutTeamSection />
    </>
  );
}

export function AboutSection({ className, children }) {
  return (
    <PageSection className={`gap-5 my-5 px-5 lg:px-35 ${className}`}>
      {children}
    </PageSection>
  );
}
