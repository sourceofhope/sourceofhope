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
      <div className="text-sm md:text-md lg:text-lg grid gap-3 text-neutral-600">
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
        <p className="text-sm md:text-md lg:text-lg pl-5 py-0 border-l-2 md:text-balance lg:w-1/2">
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
    </PageSection>
  );
}
