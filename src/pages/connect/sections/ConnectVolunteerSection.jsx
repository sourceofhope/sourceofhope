import Emphasis from "../../../components/ui/Emphasis";
import Blockquote from "../../../components/ui/text/Blockquote";
import Bold from "../../../components/ui/text/Bold";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";

import { CANONICAL } from "../../../routes";
import SimpleLink from "../../../components/ui/SimpleLink";

export default function ConnectMapSection() {
  return (
    <PageSection className="justify-items-center grid gap-10 relative m-0 text-sm md:text-md lg:text-lg">
      <article className="w-full grid gap-5">
        <Title>Volunteer Opportunities</Title>
        <p>
          Make a meaningful impact by volunteering with The Source of Hope. Our
          volunteer opportunities in <Bold>Dallas and Plano</Bold> invite
          individuals, families, students, and professionals to serve side by
          side with our community. Whether you can give a single day or commit
          regularly, your time creates a{" "}
          <Emphasis>real and lasting difference</Emphasis>.
        </p>
        <p>
          Join us <Bold>every fourth Friday & Saturday</Bold> at Cornerstone
          Kitchen for Serving Hope, our monthly community outreach dedicated to
          nourishing both body and spirit. Volunteers help prepare, package, and
          serve fresh, home-cooked meals to more than{" "}
          <Emphasis>200 individuals</Emphasis> each month—including senior
          citizens, veterans, first responders, teachers, families in
          transition, and neighbors experiencing homelessness.
        </p>
        <Blockquote className="text-balance border-accent-500">
          Serving Hope takes place every <Bold>fourth Friday & Saturday</Bold>{" "}
          of the month at Cornerstone Kitchen (2627 S. Ervay Street, Dallas, TX
          75215).
        </Blockquote>
        <p>
          Volunteering with The Source of Hope is more than lending a hand—it’s
          about showing up with compassion, consistency, and care. If you’re
          ready to serve your community in a tangible way, we invite you to{" "}
          <SimpleLink to={CANONICAL.serve.absolute}>
            explore current volunteer opportunities
          </SimpleLink>{" "}
          and join us in building hope together.
        </p>
      </article>
    </PageSection>
  );
}
