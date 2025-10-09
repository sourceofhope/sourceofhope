import { AboutSection } from "../AboutPage";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

export default function AboutDescriptionSection() {
  return (
    <AboutSection className="justify-items-center py-5 grid gap-3">
      <h2 className="justify-self-start text-xlg md:text-xxlg text-balance font-urbanist">
        We're a <HighlightedText>501(c)(3)</HighlightedText>{" "}
        <span className="hidden md:inline-block">Non-profit</span> Organization
      </h2>
      <p className="text-sm md:text-md text-neutral-600">
        The Source of Hope uplifts people through <strong>health</strong>,{" "}
        <strong>wellness</strong>, and <strong>community support</strong>
        —providing meals, housing help, job placement, and scholarships. We
        focus on skills that last, from holistic health education to outdoor
        training and entrepreneurial mentorship. Independent of government
        funding, our impact is powered by volunteers, partners, and
        donors—building stronger communities, one life at a time.
      </p>
    </AboutSection>
  );
}
