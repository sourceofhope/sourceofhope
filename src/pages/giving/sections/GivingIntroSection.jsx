import PageSection from "../../PageSection";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import Bold from "../../../components/ui/text/Bold";
import Emphasis from "../../../components/ui/Emphasis";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";
import Blockquote from "../../../components/ui/text/Blockquote";

export default function GivingIntroSection() {
  return (
    <PageSection className="grid gap-6 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start">
        <Heading>LEAVE A LASTING LEGACY</Heading>
        <Title>
          What is <HighlightedText>Planned Giving?</HighlightedText>
        </Title>
      </div>

      <div className="space-y-5 text-neutral-600">
        <p>
          Planned giving — also called <Bold>legacy giving</Bold> — allows
          donors to make a meaningful charitable contribution as part of their
          long-term financial or estate planning. Unlike a typical donation,
          planned gifts are often arranged in advance and take effect at a
          future date, ensuring that{" "}
          <Emphasis>your values outlive your lifetime</Emphasis>.
        </p>
        <Blockquote className="text-balance max-w-x1 border-accent-500">
          A planned gift to The Source of Hope helps us build{" "}
          <Bold>long-term stability</Bold> so we can continue serving families,
          veterans, seniors, and students across the Dallas–Fort Worth community{" "}
          <Emphasis>for generations to come</Emphasis>.
        </Blockquote>
        <p>
          Through vehicles such as <Bold>wills</Bold>, <Bold>trusts</Bold>,{" "}
          <Bold>retirement account beneficiary designations</Bold>, and{" "}
          <Bold>life insurance policies</Bold>, anyone — regardless of income —
          can become a philanthropist and leave a transformational impact on the
          causes they love most.
        </p>
      </div>
    </PageSection>
  );
}
