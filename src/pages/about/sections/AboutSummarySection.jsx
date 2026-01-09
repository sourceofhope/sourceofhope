import PageSection from "../../PageSection";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

import Title from "../../../components/ui/text/Title";
import Bold from "../../../components/ui/text/Bold";
import { AnchorButton, LinkButton } from "../../../components/ui/Button";
import Emphasis from "../../../components/ui/Emphasis";
import { CANONICAL } from "../../../routes";

export default function AboutSummarySection() {
  return (
    <PageSection className="grid gap-5 text-sm md:text-md lg:text-lg">
      <Title className="font-semibold text-balance">
        Ready to take <HighlightedText>your next step</HighlightedText>?
      </Title>
      <div className="text-sm md:text-md lg:text-lg grid gap-5 text-neutral-600">
        <p>
          <Bold>
            At The Source of Hope, we meet people where they are—and we don’t
            give up on them.
          </Bold>{" "}
          Our work is built on compassion, trust, and showing up consistently
          for our community. We don’t just provide services; we walk alongside
          individuals and families with dignity, care, and the belief that
          healing and renewal are possible. Whether someone is facing hunger,
          housing instability, or simply feeling forgotten, we are here.
        </p>
        <p>
          Every meal shared and every moment of support reflects a commitment to
          long-term change, not quick fixes. Through the hands and hearts of
          volunteers, partners, and neighbors, we help create stability, restore
          confidence, and open doors to new opportunities.
        </p>
        <p>
          As an independent nonprofit, we receive no government
          funding—everything we do is made possible through the generosity of
          people who believe in this mission. When you stand with us, you become
          part of something deeply human and deeply hopeful—
          <Emphasis>one life, one family, one step forward at a time.</Emphasis>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-items-center gap-5 text-center text-sm md:text-md">
        <AnchorButton
          href="https://app.joinhandshake.com/e/806999/jobs"
          className="w-fit text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
          text="Apply for Emerging Professional"
        />
        <AnchorButton
          href="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
          className="w-fit text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
          text="Volunteer for an Event"
        />
        <LinkButton
          to={CANONICAL.member.absolute}
          className="w-fit text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
          text="Become a Community Sponsor"
        />
      </div>
    </PageSection>
  );
}
