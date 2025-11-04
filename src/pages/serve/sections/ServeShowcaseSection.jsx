import PageSection from "../../PageSection";

import Emphasis from "../../../components/ui/Emphasis";

export default function ServeShowcaseSection() {
  return (
    <PageSection className="justify-items-center grid gap-5">
      <div className="grid gap-1 justify-self-start justify-start">
        <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
          Be the Source Of Hope
        </h2>
        <h3 className="text-sm md:text-md text-accent-700 font-semibold">
          EVERY MEAL SERVED. EVERY SMILE SHARED. EVERY ACT OF LOVE MAKES A
          DIFFERENCE.
        </h3>
      </div>
      <div className="hidden text-sm md:text-md lg:text-lg md:grid gap-3 text-neutral-600">
        <p>
          At The Source of Hope, we’re not just another nonprofit—we’re a
          movement dedicated to creating{" "}
          <strong className="font-semibold">lasting, sustainable change</strong>
          . Our mission goes beyond temporary fixes. We focus on{" "}
          <strong className="font-semibold">
            empowering individuals with skills, education, and opportunities
          </strong>{" "}
          that transform their lives and communities for generations to come.
        </p>
        <p>
          Think of us as{" "}
          <strong className="font-semibold">five nonprofits in one</strong>—a
          united force for holistic health and wellness, outdoor education and
          survival skills, entrepreneurship and workforce development, community
          service, and academic mentorship.
        </p>
        <p className="lg:text-lg pl-3 py-0 border-l-2 text-balance w-1/2">
          "Give a man a fish, and you feed him for a day. Teach a man to fish,
          and you feed him for a lifetime."
        </p>
        <p>
          By equipping individuals with practical tools and real-world
          experience, we ensure that every dollar invested becomes a ripple of
          impact—
          <strong className="font-semibold">
            creating independent leaders, stronger families, and thriving
            communities.
          </strong>{" "}
          From nourishing the body to uplifting the spirit, we believe that true
          hope is sustainable when it’s shared.
        </p>
        <p>
          That’s our guiding principle—
          <strong className="font-normal">
            <Emphasis>empower</Emphasis>, <Emphasis>educate</Emphasis>, and{" "}
            <Emphasis>elevate</Emphasis>.
          </strong>
        </p>
      </div>
      <div className="text-sm grid gap-3 md:hidden text-neutral-600">
        <p>
          At The Source of Hope, we’re more than a nonprofit. We’re a movement
          for lasting change. Our mission is to empower through skills,
          education, and opportunity that transform lives for generations.
        </p>
        <p>
          <strong className="font-semibold">We’re like five nonprofits in one</strong>, uniting health and wellness, outdoor
          education, entrepreneurship, community service, and mentorship.
        </p>
        <p className="text-sm pl-3 py-0 border-l-2 text-balance">
          "Teach a man to fish,
          and you feed him for a lifetime."
        </p>
        <p>
          Every effort creates stronger families and thriving communities. True {" "}
          <strong className="font-semibold">hope lasts when it’s shared</strong>.
        </p>
        <p>
          <strong className="font-normal">
            Together we{" "}<Emphasis>empower</Emphasis>, <Emphasis>educate</Emphasis>,{" "} and
            <Emphasis>elevate</Emphasis>.
          </strong>
        </p>
      </div>
    </PageSection>
  );
}
