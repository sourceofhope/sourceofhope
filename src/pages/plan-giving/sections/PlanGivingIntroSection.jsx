import PageSection from "../../PageSection";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import Bold from "../../../components/ui/text/Bold";
import Emphasis from "../../../components/ui/Emphasis";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

export default function PlanGivingIntroSection() {
  return (
    <PageSection className="grid gap-6 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start">
        <Heading>LEAVE A LASTING LEGACY</Heading>
        <Title>
          What is{" "}
          <HighlightedText>Planned Giving?</HighlightedText>
        </Title>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-neutral-600">
        <p>
          Planned giving — also called <Bold>legacy giving</Bold> — allows
          donors to make a meaningful charitable contribution as part of their
          long-term financial or estate planning. Unlike a typical donation,
          planned gifts are often arranged in advance and take effect at a
          future date, ensuring that <Emphasis>your values outlive your lifetime</Emphasis>.
        </p>
        <p>
          Through vehicles such as <Bold>wills</Bold>,{" "}
          <Bold>trusts</Bold>, <Bold>retirement account beneficiary
          designations</Bold>, and <Bold>life insurance policies</Bold>, anyone
          — regardless of income — can become a philanthropist and leave a
          transformational impact on the causes they love most.
        </p>
      </div>

      <div className="bg-accent-50 border-l-4 border-accent-500 rounded-r-2xl px-6 py-5 max-w-2xl">
        <p className="text-sm md:text-md text-neutral-800">
          A planned gift to The Source of Hope helps us build{" "}
          <Bold>long-term stability</Bold> so we can continue serving families,
          veterans, seniors, and students across the Dallas–Fort Worth community
          — <Emphasis>for generations to come</Emphasis>.
        </p>
      </div>
    </PageSection>
  );
}
