import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";

export default function AboutDescriptionSection() {
  return (
    <section className="w-full md:justify-items-left items-center grid my-5 px-5 lg:px-35 justify-items-center gap-5 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title className="font-semibold text-balance">
          We&rsquo;re a <span className="text-accent-600">501(c)(3)</span>{" "}
          <span className="hidden md:inline-block">Non-profit</span> Organization
        </Title>
        <h3 className="text-sm md:text-md font-semibold text-neutral-700 uppercase tracking-wide">
          Here to Serve and Empower
        </h3>
      </div>
      
      <div className="hidden md:flex flex-col gap-5 text-neutral-600">
        <p>
          The Source of Hope serves individuals and families through{" "}
          <strong>holistic health</strong>, <strong>wellness empowerment</strong>, and{" "}
          <strong>community support</strong>, meeting real needs in real time. From
          providing nutritious meals to those experiencing hunger, to supporting
          families navigating housing transitions, to creating pathways for job
          placement and educational scholarships, we help open doors{" "}
          <Emphasis>toward stability and hope.</Emphasis>
        </p>

        <p>
          Our work doesn&rsquo;t stop at short-term help; we focus on what lasts. By
          sharing <strong>practical skills</strong> through holistic health
          education, outdoor survival and leadership experiences, and
          entrepreneurial mentorship, we help people build confidence,
          independence, and purpose. As a fully independent nonprofit, our
          mission is sustained by dedicated <strong>volunteers</strong>,{" "}
          <strong>community partners</strong>, and <strong>donors</strong> who believe
          in walking alongside others,
          <Emphasis>one step</Emphasis>, <Emphasis>one family</Emphasis>,{" "}
          <Emphasis>one act of hope at a time</Emphasis>.
        </p>
      </div>

      <div className="md:hidden flex flex-col gap-5 text-neutral-600">
        <p>
          The Source of Hope uplifts people through <strong>health</strong>,{" "}
          <strong>wellness</strong>, and <strong>community support</strong>, providing
          meals, housing help, job placement, and scholarships.
        </p>
        <p>
          We focus on skills that last, from{" "}
          <Emphasis>holistic health</Emphasis> education to outdoor training and
          entrepreneurial <Emphasis>mentorship</Emphasis>. Independent of
          government funding, our impact is powered by volunteers, partners, and
          donors—
          <strong>building stronger communities, one life at a time.</strong>
        </p>
      </div>
    </section>
  );
}
