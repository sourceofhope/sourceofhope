import { AboutSection } from "../AboutPage";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";

export default function AboutSummarySection() {
  return (
    <AboutSection>
      <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
        Ready to take <HighlightedText>your next step</HighlightedText>?
      </h2>
      <div className="text-sm md:text-md grid gap-5">
        <p>
          <strong className="font-semibold">
            At The Source of Hope, we see every person’s potential—even in the
            face of hardship.
          </strong>{" "}
          Our mission is rooted in compassion and community, offering more than
          just services—we offer dignity, purpose, and a path forward. Through
          holistic wellness and a deep belief in second chances, we uplift those
          facing hunger, housing instability, or loss of hope.
        </p>
        <p>
          Every meal served, every hand extended, is a step toward lasting
          transformation. By working hand-in-hand with volunteers, community
          partners, and donors, we create an ecosystem of support that empowers
          individuals to reclaim their futures.
        </p>
        <p>
          As an independent nonprofit, we receive no government funding—our
          impact is made possible entirely by generous hearts like yours. Stand
          with us in building stronger, healthier communities—one life at a
          time.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row justify-items-center gap-5 text-center text-sm md:text-md">
        <ExpressiveLink className="p-5 rounded-2xl bg-neutral-200 hover:bg-neutral-300 duration-500 transition-colors">
          Apply for Emerging Professional
        </ExpressiveLink>
        <ExpressiveLink className="p-5 rounded-2xl bg-neutral-200 hover:bg-neutral-300 duration-500 transition-colors">
          Volunteer for an Event
        </ExpressiveLink>
        <ExpressiveLink className="p-5 rounded-2xl bg-neutral-200 hover:bg-neutral-300 duration-500 transition-colors">
          Become a Community Sponsor
        </ExpressiveLink>
      </div>
    </AboutSection>
  );
}
