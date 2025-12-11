import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";
import Heading from "../../../components/ui/text/Heading";
import { AnchorButton } from "../../../components/ui/Button";
import Bold from "../../../components/ui/text/Bold";

export default function ConnectMapSection() {
  return (
    <PageSection className="justify-items-center grid gap-10 relative m-0 text-sm md:text-md lg:text-lg">
      <article className="w-full grid gap-5 row-start-2 md:row-start-auto text-neutral-600">
        <Title className="text-neutral-950">Careers</Title>
        <p>
          At The Source of Hope, we are dedicated to offering meaningful careers
          for <Bold>emerging professionals, volunteers, and mentors</Bold> who
          want to grow while making a lasting impact. Whether you're a student
          looking to fulfill service hours, a mentor eager to guide the next
          generation, or a passionate individual ready to volunteer.
        </p>
        <p>
          We provide <Bold>real-world opportunities</Bold> that help you build{" "}
          <Bold>your future</Bold> while serving others. Join a movement driven
          by purpose, empowerment, and heart—and become a part of the change we
          create together every day.
        </p>
        <p>
          Interns gain real-world experience by working on meaningful projects
          that directly impact lives and help shape their future careers. They
          collaborate with dedicated professionals who are passionate about{" "}
          <Bold>driving change in the nonprofit world</Bold>, building strong
          connections and learning from experienced mentors. Each role supports
          a mission with purpose, contributing to a healthier, more hopeful
          community through work that <Bold>truly makes a difference.</Bold>
        </p>
        <article className="grid gap-5">
          <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-3 w-full">
            <Heading className="border-b-2 border-neutral-300 pb-2">
              Career Programs
            </Heading>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Emerging Professional</span>
              <span className="text-neutral-600">
                Gain experience in professional settings, working on projects
                related to IT, logistics, executive assistance, and
                digital/social media marketing Limited paid opportunities
                available for students at partnered universities
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Volunteers</span>
              <span className="text-neutral-600">
                Fulfill community service hours while helping those in need Open
                to students, professionals, and anyone eager to give back to the
                community Share your expertise and help guide others through
                mentorship Learn more about how you can contribute through
                volunteering on our Volunteer page.
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Mentors</span>
              <span className="text-neutral-600">
                Provide guidance and support to emerging professionals,
                assisting with their career development and growth.
              </span>
            </div>
          </article>
          <article className="grid gap-10 md:grid-cols-[6fr_3fr] py-5 items-end">
            <div className="flex flex-col gap-5">
              <p>
                Paid positions are available for students attending our
                partnered universities. Eligible students may be compensated
                based on project needs and available scholarship funding.
              </p>
              <p>
                Join The Source of Hope and grow with purpose. Whether you’re
                guiding others or learning new skills, your time with us creates
                real change in the community.
              </p>
            </div>
            <AnchorButton className=" px-10 py-5" text="APPLY" />
          </article>
        </article>
      </article>
    </PageSection>
  );
}
