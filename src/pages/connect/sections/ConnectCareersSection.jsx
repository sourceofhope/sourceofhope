import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";
import Heading from "../../../components/ui/text/Heading";
import { AnchorButton, LinkButton } from "../../../components/ui/Button";
import Bold from "../../../components/ui/text/Bold";
import Blockquote from "../../../components/ui/text/Blockquote";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";
import { CANONICAL } from "../../../routes";
import SimpleLink from "../../../components/ui/SimpleLink";

export default function ConnectMapSection() {
  return (
    <PageSection className="justify-items-center grid gap-10 relative m-0 text-sm md:text-md lg:text-lg">
      <article className="w-full grid gap-5 row-start-2 md:row-start-auto text-neutral-950">
        <Title className="text-neutral-950">Careers</Title>
        <p>
          The Source of Hope offers meaningful{" "}
          <Bold>
            nonprofit careers, internships, and volunteer opportunities
          </Bold>{" "}
          for emerging professionals, mentors, and community members who want
          their work to serve a greater purpose. Whether you are a student
          gaining experience, a mentor giving back, or a volunteer ready to
          serve, there is a place for you here.
        </p>
        <Blockquote className="border-accent-500 text-balance">
          Join a community rooted in{" "}
          <HighlightedText>service, growth, and compassion</HighlightedText>
          —where careers are built through purpose-driven work and real
          community impact.
        </Blockquote>
        <p>
          Our interns and team members gain hands-on experience by working on
          real nonprofit projects that directly support individuals and families
          across North Texas. From logistics and technology to wellness programs
          and community outreach, every role contributes to long-term impact
          while building transferable professional skills.
        </p>
        <div className="flex flex-col lg:flex-row justify-items-center gap-5 text-center text-sm md:text-md">
          <AnchorButton
            full
            href="https://app.joinhandshake.com/e/806999/jobs"
            className="text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
            text="Apply for Emerging Professional"
          />
          <AnchorButton
            full
            href="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
            className="text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
            text="Volunteer for an Event"
          />
          <LinkButton
            to={CANONICAL.member.absolute}
            full
            className="text-neutral-950 justify-between bg-neutral-200 hover:bg-neutral-300"
            text="Become a Community Sponsor"
          />
        </div>
        <article className="grid gap-5">
          <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-5 w-full">
            <Heading className="border-b-2 border-neutral-300 pb-2">
              Career Programs
            </Heading>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Emerging Professionals</span>
              <span className="text-neutral-600">
                Nonprofit internship opportunities designed for students and
                early-career professionals. Gain experience in IT, logistics,
                executive operations, marketing, and community programs while
                building leadership and service skills. Limited paid roles
                available through partnered universities.
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Volunteers</span>
              <span className="text-neutral-600">
                Volunteer opportunities for individuals seeking community
                service hours or purpose-driven service. Open to students,
                professionals, and community members. Volunteers support food
                programs, events, wellness initiatives, and mentorship
                opportunities.
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Mentors</span>
              <span className="text-neutral-600">
                Professional mentors support emerging nonprofit leaders by
                offering career guidance, skill development, and real-world
                insight. Mentors play a vital role in shaping confident,
                service-oriented professionals.
              </span>
            </div>
          </article>
          <article className="flex flex-col gap-5">
            <p>
              Paid positions are available for students attending our partnered
              universities. Eligible students may be compensated based on
              project needs and available scholarship funding.
            </p>
            <Blockquote className="border-accent-500 text-balance">
              Paid opportunities are available{" "}
              <HighlightedText>for eligible students</HighlightedText> through
              our <Bold>partnered universities</Bold>, supporting both
              professional growth and meaningful community impact.
            </Blockquote>
            <p>
              Learn more about serving your community through our{" "}
              <SimpleLink to={CANONICAL.serve.absolute}>
                volunteer programs
              </SimpleLink>{" "}
              or explore how our education and wellness initiatives support
              long-term change.
            </p>
          </article>
        </article>
      </article>
    </PageSection>
  );
}
