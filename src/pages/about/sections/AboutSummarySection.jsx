import PageSection from "../../PageSection";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import Title from "../../../components/ui/text/Title";
import Bold from "../../../components/ui/text/Bold";
import { LinkButton } from "../../../components/ui/Button";
import Emphasis from "../../../components/ui/Emphasis";

export default function AboutSummarySection() {
  return (
    <PageSection className="grid gap-5">
      <Title className="font-semibold text-balance">
        Ready to take <HighlightedText>your next step</HighlightedText>?
      </Title>
      <div className="text-sm md:text-md lg:text-lg grid gap-5 text-neutral-600">
        <p>
          <Bold>
            At The Source of Hope, we see every person’s potential—even in the
            face of hardship.
          </Bold>{" "}
          Our mission is rooted in compassion and community, offering more than
          just services—we offer dignity, purpose, and a path forward. Through
          holistic wellness and a deep belief in second chances, we uplift those
          facing hunger, housing instability, or loss of hope.
        </p>
        <p>
          Every meal served, every hand extended, is a step toward lasting
          transformation. By working hand-in-hand with volunteers, community
          partners, and donors, we create an ecosystem of support that empowers
          individuals to reclaim their futures.
        </p>
        <p>
          As an independent nonprofit, we receive no government funding—our
          impact is made possible entirely by generous hearts like yours. Stand
          with us in building stronger, healthier communities—
          <Emphasis>one life at a time.</Emphasis>
        </p>
      </div>
      <div className="flex flex-col lg:flex-row justify-items-center gap-5 text-center text-sm md:text-md">
        <LinkButton
          className="w-fit text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
          text="Apply for Emerging Professional"
        />
        <LinkButton
          className="w-fit text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
          text="Volunteer for an Event"
        />
        <LinkButton
          className="w-fit text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
          text="Become a Community Sponsor"
        />
      </div>
    </PageSection>
  );
}
