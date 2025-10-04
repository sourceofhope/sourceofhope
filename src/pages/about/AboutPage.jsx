import Emphasis from "../../components/ui/Emphasis";
import ExpressiveAnchor from "../../components/ui/expressive/ExpressiveAnchor";
import { HighlightedText } from "../../components/ui/expressive/ExpressiveText";
import PageHeader from "../PageHeader";

import PageSection from "../PageSection";

export default function AboutPage() {
  return (
    <>
      <PageHeader src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344">
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          ABOUT
        </h2>
      </PageHeader>
      <AboutSection className="justify-items-center py-5 grid gap-3">
        <h2 className="justify-self-start text-xlg md:text-xxlg text-balance font-urbanist">
          We're a{" "}
          <HighlightedText className="font-semibold">501(c)(3)</HighlightedText>{" "}
          <span className="hidden md:inline-block">Non-profit</span>{" "}
          Organization
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
      <AboutSection className="grid md:grid-cols-[6fr_4fr] gap-5">
        <article className="grid gap-5 self-start">
          <div className="grid gap-3">
            <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
              Founded in 2014 on our{" "}
              <Emphasis>
                <span className="hidden md:inline-block">guiding</span>{" "}
                principle
              </Emphasis>
            </h2>
            <p className="text-sm md:text-md text-neutral-600 px-5 py-0 border-l-2 text-balance">
              "empower with dignity—meet urgent needs while equipping people
              with lifelong skills, wellness, and community so hope becomes
              sustainable."
            </p>
            <p className="px-5 w-fit text-neutral-600">
              <ExpressiveAnchor>
                – Co-founder,{" "}
                <strong className="font-semibold">Quynh Chau Stone</strong>
              </ExpressiveAnchor>
            </p>
          </div>
          <div className="grid gap-3">
            <h2 className="text-md md:text-lg">Mission</h2>
            <p className="text-sm md:text-md">
              Bringing hope and healing by providing meals, education, wellness,
              and resources that uplift and empower communities in need.
            </p>
          </div>
          <div className="grid gap-3">
            <h2 className="text-md md:text-lg">Vision</h2>
            <p className="text-sm md:text-md">
              A world where every person has the wellness, skills, and community
              to thrive—so cycles of hardship give way to lives of purpose and
              communities that flourish.
            </p>
          </div>
        </article>
        <article className="grid self-center justify-items-center">
          <img className="block w-full aspect-square bg-accent-900 max-w-[350px] rounded-2xl object-cover object-center" />
        </article>
      </AboutSection>
    </>
  );
}

export function AboutSection({ className, children }) {
  return (
    <PageSection className="gap-5 my-5 px-5 lg:px-35">
      <div className={className}>{children}</div>
    </PageSection>
  );
}
