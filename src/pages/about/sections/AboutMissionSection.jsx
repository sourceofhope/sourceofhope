import PageSection from "../../PageSection";

import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Emphasis from "../../../components/ui/Emphasis"

export default function AboutMissionSection() {
  return (
    <PageSection className="grid md:grid-cols-[6fr_4fr] gap-5 bg-neutral-200 items-center py-10">
      <article className="grid gap-5 self-start">
        <div className="grid gap-3">
          <h2 className="text-xlg md:text-xxlg font-urbanist md:text-balance">
            Founded in 2014 on our{" "}
            <Emphasis>
              <span className="hidden md:inline-block">guiding</span> principle
            </Emphasis>
          </h2>
          <p className="text-sm md:text-md md:ml-5 text-neutral-600 pl-5 py-0 border-l-2 text-balance">
            "empower with dignity—meet urgent needs while equipping people with
            lifelong skills, wellness, and community so hope becomes
            sustainable."
          </p>
          <p className="text-sm md:text-md md:ml-5 pl-5 w-fit text-neutral-600">
            <ExpressiveAnchor>
              – Co-founder,{" "}
              <strong className="font-semibold">Quynh Chau Stone</strong>
            </ExpressiveAnchor>
          </p>
        </div>
        <div className="grid gap-3">
          <h3 className="text-sm md:text-md border-b-2 pb-1/2 w-fit font-semibold">
            Mission
          </h3>
          <p className="text-sm md:text-md">
            Bringing hope and healing by providing meals, education, wellness,
            and resources that uplift and empower communities in need.
          </p>
        </div>
        <div className="grid gap-3">
          <h3 className="text-sm md:text-md border-b-2 pb-1/2 w-fit font-semibold">
            Vision
          </h3>
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
    </PageSection>
  );
}
