"use client";

import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import { ExpressiveNumber } from "@/components/ui/ExpressiveNumber";

const ASSET_VERSION = "v2";

export default function HomeImpactSection() {
  return (
    <section className="relative py-15 px-5 lg:px-35 bg-accent-800 text-neutral-50 overflow-hidden w-full">
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <article className="flex flex-col gap-10 z-10">
          <div className="flex flex-col gap-3">
            <Title className="tracking-wide text-center md:text-left text-neutral-50">
              COMMUNITY IMPACT
            </Title>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Real <Emphasis className="text-neutral-100">results</Emphasis> and
              powerful <Emphasis className="text-neutral-100">change</Emphasis>{" "}
              in our community
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <ExpressiveNumber end={16} caption="Years of Service" post="+" />
            <ExpressiveNumber
              end={900}
              caption="Holistic Wellness Aid"
              pre="$"
              post="K"
            />
            <ExpressiveNumber end={353} caption="Free Meals Served" post="K" />
            <ExpressiveNumber
              end={500}
              caption="Donations Received"
              pre="$"
              post="K"
            />
            <div className="col-span-2 sm:col-span-1 sm:col-start-2 flex justify-center">
              <ExpressiveNumber end={273} caption="Volunteer Hours" post="K" />
            </div>
          </div>
          <div className="w-fit">
            <ExpressiveLink
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-neutral-50 transition"
              ariaLabel="Learn more about The Source of Hope's impact in our community"
              to="/about"
            >
              VIEW OUR IMPACT
            </ExpressiveLink>
          </div>
        </article>
        <div className="hidden lg:block relative h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${ASSET_VERSION}/core/placeholder.webp`}
            alt="Community members benefiting from The Source of Hope programs"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
