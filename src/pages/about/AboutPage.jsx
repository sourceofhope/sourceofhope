import Emphasis from "../../components/ui/Emphasis";
import ExpressiveAnchor from "../../components/ui/expressive/ExpressiveAnchor";
import { HighlightedText } from "../../components/ui/expressive/ExpressiveText";

import PageSection from "../PageSection";

export default function AboutPage() {
  return (
    <>
      <PageSection className="justify-items-center items-start gap-0 pt-30 mt-0">
        <h2 className="text-xxlg">
          We're a{" "}
          <HighlightedText className="font-semibold">501(c)(3)</HighlightedText>{" "}
          Organization
        </h2>
        <p className="text-sm md:text-md text-neutral-500">
          The Source of Hope uplifts people through health, wellness, and
          community support—providing meals, housing help, job placement, and
          scholarships. We focus on skills that last, from holistic health
          education to outdoor training and entrepreneurial mentorship.
          Independent of government funding, our impact is powered by
          volunteers, partners, and donors—building stronger communities, one
          life at a time.
        </p>
      </PageSection>
      <PageSection className="grid-flow-row md:grid-flow-col md:grid-cols-[60%_40%] gap-0 items-start">
        <article className="flex gap-5 flex-col">
          <h2 className="text-xlg">
            Founded in 2014 on <Emphasis>principle</Emphasis>:
          </h2>
          <div className="flex flex-col text-sm md:text-md">
            <p className="border-l-2 px-2 py-2.5 text-neutral-500 text-balance">
              "empower with dignity—meet urgent needs while equipping people
              with lifelong skills, wellness, and community so hope becomes
              sustainable."
            </p>
            <p className="w-fit font-light ml-3 md:text-left text-neutral-600">
              <ExpressiveAnchor href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.linkedin.com/in/qu%25E1%25BB%25B3nh-ch%25C3%25A2u-qc-stone-87185b34&ved=2ahUKEwjywp_wrYGQAxXtliYFHUMmF_UQFnoECB4QAQ&usg=AOvVaw0atvVnt9I7rD053D7ksuUk">
                – Co-founder,{" "}
                <strong className="font-semibold">Quynh Chau Stone</strong>
              </ExpressiveAnchor>
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Mission</h2>
            <p className="text-balance">
              Bringing hope and healing by providing meals, education, wellness,
              and resources that uplift and empower communities in need.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Vision</h2>
            <p className="text-balance">
              A world where every person has the wellness, skills, and community
              to thrive—so cycles of hardship give way to lives of purpose and
              communities that flourish.
            </p>
          </div>
        </article>
        <article>
          <img className="w-full aspect-square bg-accent-900 rounded-2xl object-center object-cover" />
        </article>
      </PageSection>
    </>
  );
}
