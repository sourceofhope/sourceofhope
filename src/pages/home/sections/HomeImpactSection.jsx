import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import ExpressiveNumber from "../../../components/ui/expressive/ExpressiveNumber";
import { DefaultGenerator } from "../../../components/ui/expressive/DefaultGenerator";

import { HomeContent } from "../HomePage";
import Title from "../../../components/ui/text/Title";
import { useState } from "react";
import Emphasis from "../../../components/ui/Emphasis";
import { CANONICAL } from "../../../routes";

export default function HomeImpactSection() {
  return (
    <HomeContent className="relative py-15 px-5 lg:px-35 bg-accent-800 text-neutral-50 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <article className="flex flex-col gap-10 z-10 ">
          <div className="flex flex-col gap-3">
            <Title className="tracking-wide text-center md:text-left">
              COMMUNITY IMPACT
            </Title>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Real <Emphasis className="text-neutral-100">results</Emphasis> and
              powerful <Emphasis className="text-neutral-100">change</Emphasis>{" "}
              in our community
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <ImpactNumber end={16} caption="Years of Service" post="+" />
            <ImpactNumber
              end={900}
              caption="Holistic Wellness Aid"
              pre="$"
              post="K"
            />
            <ImpactNumber end={353} caption="Free Meals Served" post="K" />
            <ImpactNumber
              end={500}
              caption="Donations Received"
              pre="$"
              post="K"
            />
            <div className="col-span-2 sm:col-span-1 sm:col-start-2 flex justify-center">
              <ImpactNumber end={273} caption="Volunteer Hours" post="K" />
            </div>
          </div>
          <div className="w-fit">
            <ExpressiveLink
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-neutral-50 transition"
              ariaLabel="Learn more about The Source of Hope's impact in our community"
              to={CANONICAL.about}>
              VIEW OUR IMPACT
            </ExpressiveLink>
          </div>
        </article>
        <article className="relative hidden lg:flex justify-end">
          <img
            src="/core/TSOH-Impact.webp"
            alt="TSOH Impact"
            className="relative w-[600px] max-w-full rounded-2xl object-cover shadow-2xl"
          />
        </article>
      </div>
    </HomeContent>
  );
}

function ImpactNumber({ end, caption, pre = "", post = "" }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <strong className="flex items-center gap-1">
        {pre}
        <ExpressiveNumber
          className="text-xxlg font-semibold"
          start={1}
          end={end}
          generator={DefaultGenerator.EASE_IN_OUT}
        />
        {post}
      </strong>
      <p className="border-b-2 pb-2 w-full text-center text-sm md:text-md text-neutral-300 border-neutral-500">
        {caption}
      </p>
    </div>
  );
}
