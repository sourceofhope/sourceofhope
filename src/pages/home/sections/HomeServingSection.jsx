import ParallaxLayer from "../../../components/ui/parallax/ParallaxLayer";
import ParallaxSection from "../../../components/ui/parallax/ParallaxSection";

import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { HomeContent } from "../HomePage";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import { CANONICAL } from "../../../routes";

export function HomeServingSection() {
  return (
    <HomeContent className="hidden md:block relative">
      <ParallaxSection className="relative h-170 overflow-hidden">
        <ParallaxLayer layer={0} ratio={1}>
          <img
            className="w-full overflow-hidden h-full object-cover brightness-[.8] contrast-[1.1]"
            src="/core/TSOH-Service.jpg"
            alt=""
          />
        </ParallaxLayer>
        <ParallaxLayer
          layer={1}
          ratio={1 / 4}
          className="flex w-full items-center justify-center lg:justify-end p-5 lg:px-35">
          <ServingCard />
        </ParallaxLayer>
      </ParallaxSection>
    </HomeContent>
  );
}

export function ServingCard({ className }) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl shadow-2x overflow-hidden lg:w-1/3 max-w-115 h-fit p-5 bg-neutral-50 text-neutral-950 ${className}`}>
      <Heading className="px-5">GET INVOLVED</Heading>
      <Title className="px-5 text-balance">
        Let's Explore Your Next Steps, Together.
      </Title>
      <ul className="grid text-sm">
        <li>
          <ExpressiveLink
            to={CANONICAL.member}
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors">
            Become a Community Sponsor
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors">
            Become a Tutor or Mentor
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveAnchor
            href="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors">
            Volunteer for an Event
          </ExpressiveAnchor>
        </li>
        <li>
          <ExpressiveLink className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors">
            Stay Connected
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveAnchor
            href="https://app.joinhandshake.com/e/806999/jobs"
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors">
            Apply for Emerging Professional
          </ExpressiveAnchor>
        </li>
      </ul>
    </article>
  );
}
