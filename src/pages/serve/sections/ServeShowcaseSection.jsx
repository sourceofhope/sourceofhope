import PageSection from "../../PageSection";

import Emphasis from "../../../components/ui/Emphasis";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import Blockquote from "../../../components/ui/text/Blockquote";
import Bold from "../../../components/ui/text/Bold";

export default function ServeShowcaseSection() {
  return (
    <PageSection className="justify-items-center grid gap-5">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title>Be the Source Of Hope</Title>
        <Heading>
          EVERY MEAL SERVED. EVERY SMILE SHARED. EVERY ACT OF LOVE MAKES A
          DIFFERENCE.
        </Heading>
      </div>
      <div className="hidden text-sm md:text-md lg:text-lg md:grid gap-5 text-neutral-600">
        <p>
          At The Source of Hope, we’re not just another nonprofit—we’re a
          movement dedicated to creating{" "}
          <Bold>lasting, sustainable change</Bold>. Our mission goes beyond
          temporary fixes. We focus on{" "}
          <Bold>
            empowering individuals with skills, education, and opportunities
          </Bold>{" "}
          that transform their lives and communities for generations to come.
        </p>
        <p>
          Think of us as <Bold>five nonprofits in one</Bold>—a united force for
          holistic health and wellness, outdoor education and survival skills,
          entrepreneurship and workforce development, community service, and
          academic mentorship.
        </p>
        <Blockquote className="lg:text-lg border-accent-600 text-balance w-1/2">
          "Give a man a fish, and you feed him for a day. Teach a man to fish,
          and you feed him for a lifetime."
        </Blockquote>
        <p>
          By equipping individuals with practical tools and real-world
          experience, we ensure that every dollar invested becomes a ripple of
          impact—
          <Bold>
            creating independent leaders, stronger families, and thriving
            communities.
          </Bold>{" "}
          From nourishing the body to uplifting the spirit, we believe that true
          hope is sustainable when it’s shared.
        </p>
        <p>
          That’s our guiding principle—
          <Bold>
            <Emphasis>empower</Emphasis>, <Emphasis>educate</Emphasis>, and{" "}
            <Emphasis>elevate</Emphasis>.
          </Bold>
        </p>
      </div>
      <div className="text-sm grid gap-3 md:hidden text-neutral-600">
        <p>
          At The Source of Hope, we’re more than a nonprofit. We’re a movement
          for lasting change. Our mission is to empower through skills,
          education, and opportunity that transform lives for generations.
        </p>
        <p>
          <Bold>We’re like five nonprofits in one</Bold>, uniting health and
          wellness, outdoor education, entrepreneurship, community service, and
          mentorship.
        </p>
        <p className="text-sm pl-3 py-0 border-l-4 border-accent-600 text-balance">
          "Teach a man to fish, and you feed him for a lifetime."
        </p>
        <p>
          Every effort creates stronger families and thriving communities. True{" "}
          <Bold>hope lasts when it’s shared</Bold>.
        </p>
        <p>
          <Bold>
            Together we <Emphasis>empower</Emphasis>,
            <Emphasis>educate</Emphasis>, and <Emphasis>elevate</Emphasis>.
          </Bold>
        </p>
      </div>
    </PageSection>
  );
}
