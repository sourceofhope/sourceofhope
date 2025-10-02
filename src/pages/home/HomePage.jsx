import { DefaultGenerator } from "../../components/ui/expressive/DefaultGenerator";
import { HighlightedText } from "../../components/ui/expressive/ExpressiveText";
import ExpressiveLink from "../../components/ui/expressive/ExpressiveLink";

import HomeImpactSection from "./sections/HomeImpactSection";
import HomeIntroductionSection from "./sections/HomeIntroductionSection";
import HomeMissionSection from "./sections/HomeMissionSection";
import HomeResourcesSection from "./sections/HomeResourcesSection";
import HomePublicationsSection from "./sections/HomePublicationsSection";

import PageSection from "../PageSection";

export default function HomePage() {
  return (
    <>
      <HomeIntroductionSection />
      <HomeMissionSection />
      <HomeImpactSection />
      <HomeResourcesSection />
      <HomePublicationsSection />
    </>
  );
}

export function HomeSection({ title, className, children, caption, to }) {
  return (
    <PageSection>
      {title ? (
        <HighlightedText
          className="w-fit justify-self-center"
          generator={DefaultGenerator.EASE_IN_OUT}
        >
          <h2 className="text-xxlg font-semibold font-urbanist">{title}</h2>
        </HighlightedText>
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
