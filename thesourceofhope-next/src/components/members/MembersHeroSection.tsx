import HighlightedText from "@/components/ui/HighlightedText";
import Blockquote from "@/components/ui/Blockquote";
import Bold from "@/components/ui/Bold";
import Heading from "@/components/ui/Heading";
import Title from "@/components/ui/Title";
import PageSection from "@/components/ui/PageSection";

export default function MembersHeroSection() {
  return (
    <PageSection className="grid gap-6 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start">
        <Heading>SUPPORT OUR MISSION</Heading>
        <Title>
          Our <HighlightedText>Membership Plans</HighlightedText>
        </Title>
      </div>

      <div className="space-y-5 text-neutral-600">
        <p>
          When you become a member of The Source of Hope, you&apos;re investing in
          the <Bold>heartbeat of our community</Bold>—supporting teachers,
          veterans, first responders, students, at-risk families, seniors, and
          our unhoused neighbors.
        </p>
        <Blockquote className="text-neutral-600 max-w-[60ch] border-accent-600">
          Prefer to give once? You can also donate anytime from our{" "}
          <a
            className="font-semibold text-accent-500"
            href="https://donate.stripe.com/8wM5kHal16fC4so8ww">
            Donate page
          </a>
          . Membership is for supporters who want a consistent monthly impact.
        </Blockquote>
        <p>
          Membership starts at as low as <Bold>$1/month</Bold>. Every tier helps
          us <Bold>feed, educate, and restore hope</Bold> through our programs
          and community partners.
        </p>
      </div>
    </PageSection>
  );
}
