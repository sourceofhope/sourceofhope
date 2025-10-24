import PageSection from "../../PageSection";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

export default function AboutDescriptionSection() {
  return (
    <PageSection className="justify-items-center grid gap-3">
      <h2 className="justify-self-start text-xlg md:text-xxlg text-balance font-urbanist">
        We're a <HighlightedText>501(c)(3)</HighlightedText>{" "}
        <span className="hidden md:inline-block">Non-profit</span> Organization
      </h2>
      <div className="hidden md:flex flex-col gap-5 text-sm md:text-md lg:text-lg text-neutral-600">
        <p>
          The Source of Hope uplifts individuals and families through{" "}
          <strong>holistic health</strong>,{" "}
          <strong>wellness empowerment</strong>, and{" "}
          <strong>community support</strong>—providing nutritious meals to the
          hungry, housing assistance for those in transition, job placement
          opportunities, and educational scholarships that open doors to a
          better future.
        </p>

        <p>
          Our mission goes beyond short-term relief—we equip people with{" "}
          <strong>skills that last a lifetime</strong>. Through hands-on
          holistic health education, outdoor survival and leadership training,
          and entrepreneurial mentorship, we nurture self-sufficiency and
          purpose. Entirely independent of government funding, our impact is
          driven by compassionate <strong>volunteers</strong>,{" "}
          <strong>partners</strong>, and{" "}
          <strong>donors</strong> who come together to build stronger, healthier
          communities—one act of hope at a time.
        </p>
      </div>
      <div className="md:hidden flex flex-col gap-5 text-sm md:text-md lg:text-lg text-neutral-600">
        <p>
          The Source of Hope uplifts people through <strong>health</strong>,{" "}
          <strong>wellness</strong>, and <strong>community support</strong>
          —providing meals, housing help, job placement, and scholarships.
        </p>
        <p>
          We focus on skills that last, from holistic health education to
          outdoor training and entrepreneurial mentorship. Independent of
          government funding, our impact is powered by volunteers, partners, and
          donors—building stronger communities, one life at a time.
        </p>
      </div>
    </PageSection>
  );
}
