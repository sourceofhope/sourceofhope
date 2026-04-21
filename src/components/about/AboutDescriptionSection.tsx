import PageSection from "@/components/ui/PageSection";
import HighlightedText from "@/components/ui/HighlightedText";
import Title from "@/components/ui/Title";
import Bold from "@/components/ui/Bold";
import Emphasis from "@/components/ui/Emphasis";
import Heading from "@/components/ui/Heading";

export default function AboutDescriptionSection() {
  return (
    <PageSection className="justify-items-center grid gap-5 pt-5 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title className="font-semibold text-balance">
          We&rsquo;re a <HighlightedText>501(c)(3)</HighlightedText>{" "}
          <span className="hidden md:inline-block">Non-profit</span>{" "}
          Organization
        </Title>
        <Heading>Here to Serve and Empower</Heading>
      </div>

      <div className="hidden md:flex flex-col gap-5 text-neutral-600">
        <p>
          The Source of Hope serves individuals and families through{" "}
          <Bold>holistic health</Bold>, <Bold>wellness empowerment</Bold>, and{" "}
          <Bold>community support</Bold>, meeting real needs in real time. From
          providing nutritious meals to those experiencing hunger, to supporting
          families navigating housing transitions, to creating pathways for job
          placement and educational scholarships, we help open doors{" "}
          <Emphasis>toward stability and hope.</Emphasis>
        </p>

        <p>
          Our work doesn&rsquo;t stop at short-term help, we focus on what
          lasts. By sharing <Bold>practical skills</Bold> through holistic
          health education, outdoor survival and leadership experiences, and
          entrepreneurial mentorship, we help people build confidence,
          independence, and purpose. As a fully independent nonprofit, our
          mission is sustained by dedicated <Bold>volunteers</Bold>,{" "}
          <Bold>community partners</Bold>, and <Bold>donors</Bold> who believe
          in walking alongside others,
          <Emphasis>one step</Emphasis>, <Emphasis>one family</Emphasis>,{" "}
          <Emphasis>one act of hope at a time</Emphasis>.
        </p>
      </div>

      <div className="md:hidden flex flex-col gap-5 text-neutral-600">
        <p>
          The Source of Hope uplifts people through <Bold>health</Bold>,{" "}
          <Bold>wellness</Bold>, and <Bold>community support</Bold>, providing
          meals, housing help, job placement, and scholarships.
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
