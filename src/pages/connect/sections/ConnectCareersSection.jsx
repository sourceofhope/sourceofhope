import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";
import Heading from "../../../components/ui/text/Heading";

export default function ConnectMapSection() {
  return (
    <PageSection className="justify-items-center grid gap-10 relative m-0">
      <article className="w-full grid gap-5 row-start-2 md:row-start-auto">
        <Title>Careers</Title>
        <p>
          At The Source of Hope, we are dedicated to offering meaningful careers
          for emerging professionals, volunteers, and mentors who want to grow
          while making a lasting impact. Whether you’re a student looking to
          fulfill service hours, a mentor eager to guide the next generation, or
          a passionate individual ready to volunteer, we provide real-world
          opportunities that help you build your future while serving others.
          Join a movement driven by purpose, empowerment, and heart—and become a
          part of the change we create together every day.
        </p>
        <p>
          Interns gain real-world experience by working on meaningful projects
          that directly impact lives and help shape their future careers. They
          collaborate with dedicated professionals who are passionate about
          driving change in the nonprofit world, building strong connections and
          learning from experienced mentors. Each role supports a mission with
          purpose, contributing to a healthier, more hopeful community through
          work that truly makes a difference.
        </p>
        <article>
          <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2 w-full">
            <Heading className="border-b-2 border-neutral-300 pb-2">
              Career Programs
            </Heading>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Emerging Professional</span>
              <span>
                Gain experience in professional settings, working on projects
                related to IT, logistics, executive assistance, and
                digital/social media marketing Limited paid opportunities
                available for students at partnered universities
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Volunteers</span>
              <span>
                Fulfill community service hours while helping those in need Open
                to students, professionals, and anyone eager to give back to the
                community Share your expertise and help guide others through
                mentorship Learn more about how you can contribute through
                volunteering on our Volunteer page.
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
              <span className="font-medium">Mentors</span>
              <span>
                Provide guidance and support to emerging professionals,
                assisting with their career development and growth.
              </span>
            </div>
          </article>
        </article>
      </article>
    </PageSection>
  );
}
