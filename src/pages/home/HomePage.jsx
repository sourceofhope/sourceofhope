import { DefaultGenerator } from "../../components/ui/expressive/DefaultGenerator";
import { HighlightedText } from "../../components/ui/expressive/ExpressiveText";
import ExpressiveLink from "../../components/ui/expressive/ExpressiveLink";

import HomeImpactSection from "./sections/HomeImpactSection";
import HomeIntroductionSection from "./sections/HomeIntroductionSection";
import HomeMissionSection from "./sections/HomeMissionSection";
import HomeResourcesSection from "./sections/HomeResourcesSection";
import HomePublicationsSection from "./sections/HomePublicationsSection";

export default function Home() {
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

export function HomeSection({ className, children, title, caption, to }) {
  return (
    <section
      className={`my-5 px-5 lg:px-35 w-full h-full justify-items-left items-center grid gap-5`}
    >
      <HighlightedText className="w-fit" generator={DefaultGenerator.EASE_IN_OUT}>
        <h2 className="text-xxlg font-semibold font-urbanist">{title}</h2>
      </HighlightedText>
      <div className={className}>{children}</div>
      <button className="justify-self-end w-fit text-neutral-600">
        <ExpressiveLink className="text-sm" to={to}>
          {caption}
        </ExpressiveLink>
      </button>
    </section>
  );
}
