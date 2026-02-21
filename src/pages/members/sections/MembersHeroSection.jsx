import Blockquote from "../../../components/ui/text/Blockquote";
import Bold from "../../../components/ui/text/Bold";

export default function MembersHeroSection() {
  return (
    <section className="flex flex-col gap-4 p-5 lg:px-35">
      <p className="text-neutral-800">
        When you become a member of The Source of Hope, you’re investing in the{" "}
        <Bold>heartbeat of our community</Bold>—supporting teachers, veterans,
        first responders, students, at-risk families, seniors, and our unhoused
        neighbors.
      </p>
      <Blockquote className="text-neutral-600 max-w-[60ch] border-accent-600">
        Prefer to give once? You can also donate anytime from our{" "}
        <a
          className="font-semibold"
          href="https://donate.stripe.com/8wM5kHal16fC4so8ww">
          Donate page
        </a>
        . Membership is for supporters who want a consistent monthly impact.
      </Blockquote>
      <p className="text-neutral-800">
        Membership starts at <Bold>$50/month</Bold>. Every tier helps us{" "}
        <Bold>feed, educate, and restore hope</Bold> through our programs and
        community partners.
      </p>
    </section>
  );
}
