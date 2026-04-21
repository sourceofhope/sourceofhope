"use client";

import Image from "next/image";
import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveLink from "@/components/ui/expressive/ExpressiveLink";
import { ExpressiveNumber } from "@/components/ui/expressive/ExpressiveNumber";
import { ASSET_VERSION } from "@/lib/environment";

export default function HomeImpactSection() {
  return (
    <section className="relative overflow-hidden bg-accent-800 px-5 py-15 text-neutral-50 lg:px-15">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-neutral-50/5 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <article className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Title className="text-center tracking-wide text-neutral-50 md:text-left">
              COMMUNITY IMPACT
            </Title>

            <p className="max-w-2xl text-md leading-relaxed text-neutral-300 lg:text-lg">
              Real <Emphasis className="text-neutral-100">results</Emphasis> and
              powerful <Emphasis className="text-neutral-100">change</Emphasis>{" "}
              in our community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            <div className="rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5 backdrop-blur-sm">
              <ExpressiveNumber end={16} caption="Years of Service" post="+" />
            </div>

            <div className="rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5 backdrop-blur-sm">
              <ExpressiveNumber
                end={900}
                caption="Holistic Aid"
                pre="$"
                post="K"
              />
            </div>

            <div className="rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5 backdrop-blur-sm">
              <ExpressiveNumber end={353} caption="Free Meals" post="K" />
            </div>

            <div className="rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5 backdrop-blur-sm">
              <ExpressiveNumber
                end={500}
                caption="Donations"
                pre="$"
                post="K"
              />
            </div>

            <div className="col-span-2 rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5 backdrop-blur-sm sm:col-span-1">
              <ExpressiveNumber end={273} caption="Volunteer Hours" post="K" />
            </div>
          </div>

          <div>
            <ExpressiveLink
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 transition hover:text-neutral-50"
              ariaLabel="Learn more about The Source of Hope's impact in our community"
              to="/about">
              VIEW OUR IMPACT
            </ExpressiveLink>
          </div>
        </article>

        <div className="hidden lg:block">
          <div className="relative h-112 overflow-hidden rounded-2xl border border-neutral-50/10 bg-neutral-50/5">
            <Image
              src={`/${ASSET_VERSION}/core/TSOH-Poster.webp`}
              alt="Community members benefiting from The Source of Hope programs"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
