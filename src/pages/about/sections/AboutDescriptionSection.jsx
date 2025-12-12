import PageSection from "../../PageSection";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";
import Title from "../../../components/ui/text/Title";
import Bold from "../../../components/ui/text/Bold";
import Emphasis from "../../../components/ui/Emphasis";

export default function AboutDescriptionSection() {
  return (
    <PageSection className="justify-items-center grid gap-5">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title className="font-semibold text-balance">
          We're a <HighlightedText>501(c)(3)</HighlightedText>{" "}
          <span className="hidden md:inline-block">Non-profit</span>{" "}
          Organization
        </Title>
        <h3 className="text-sm md:text-md text-accent-700 font-semibold">
          HERE TO SERVE. HEAL. AND EMPOWER.
        </h3>
      </div>
      <div className="hidden md:flex flex-col gap-5 text-md lg:text-lg text-neutral-600">
        <p>
          The Source of Hope uplifts individuals and families through{" "}
          <Bold>holistic health</Bold>, <Bold>wellness empowerment</Bold>, and{" "}
          <Bold>community support</Bold>—providing nutritious meals to the
          hungry, housing assistance for those in transition, job placement
          opportunities, and educational scholarships that open doors{" "}
          <Emphasis>to a better future.</Emphasis>
        </p>

        <p>
          Our mission goes beyond short-term relief—we equip people with{" "}
          <Bold>skills that last a lifetime</Bold>. Through hands-on holistic
          health education, outdoor survival and leadership training, and
          entrepreneurial mentorship, we nurture self-sufficiency and purpose.
          Entirely independent of government funding, our impact is driven by
          compassionate <Bold>volunteers</Bold>, <Bold>partners</Bold>, and{" "}
          <Bold>donors</Bold> who come together to build stronger, healthier
          communities—<Emphasis>one act of hope at a time.</Emphasis>
        </p>
      </div>
      <div className="md:hidden flex flex-col gap-5 text-sm text-neutral-600">
        <p>
          The Source of Hope uplifts people through <Bold>health</Bold>,{" "}
          <Bold>wellness</Bold>, and <Bold>community support</Bold>
          —providing meals, housing help, job placement, and scholarships.
        </p>
        <p>
          We focus on skills that last, from{" "}
          <Emphasis>holistic health</Emphasis> education to outdoor training and
          entrepreneurial <Emphasis>mentorship</Emphasis>. Independent of
          government funding, our impact is powered by volunteers, partners, and
          donors—
          <Bold>building stronger communities, one life at a time.</Bold>
        </p>
      </div>
    </PageSection>
  );
}
