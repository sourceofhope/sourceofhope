import Image from "next/image";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import Title from "@/components/ui/Title";
import ParallaxLayer from "../ui/parallax/ParallaxLayer";
import ParallaxSection from "../ui/parallax/ParallaxSection";
import Heading from "../ui/Heading";

const ASSET_VERSION = "v2";

export default function HomeServingSection() {
  return (
    <section
      className={`hidden w-full gap-10 relative md:flex bg-neutral-50 items-center`}>
      <ParallaxSection className="relative w-full h-170 overflow-hidden">
        <ParallaxLayer layer={0} ratio={1}>
          <Image
            src={`/${ASSET_VERSION}/core/TSOH-Service.webp`}
            alt="People cooking food at Serving Hope Event"
            className="h-full w-full object-cover brightness-75"
            fill
            sizes="100vw"
          />
        </ParallaxLayer>
        <ParallaxLayer
          layer={1}
          ratio={1 / 4}
          className="flex w-full items-center justify-center lg:justify-end p-5 lg:px-35">
          <ServingCard />
        </ParallaxLayer>
      </ParallaxSection>
    </section>
  );
}

interface ServingCardProps {
  className?: string;
}

export function ServingCard({ className }: ServingCardProps) {
  return (
    <article
      className={`${className} flex h-fit flex-col gap-5 overflow-hidden rounded-2xl bg-neutral-50 p-5 text-neutral-950 shadow-2xl lg:w-1/3`}>
      <Heading className="px-5">Get Involved</Heading>

      <Title className="px-5 text-balance text-2xl md:text-3xl">
        Let&apos;s Explore Your Next Steps, Together
      </Title>

      <ul className="grid text-sm w-full">
        <li>
          <ExpressiveLink
            to="/members"
            className="rounded-2xl p-5 w-full grid justify-between transition-colors duration-500 hover:bg-neutral-200">
            Become a Community Sponsor
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="/serve/educationHope"
            className="rounded-2xl p-5 w-full grid justify-between transition-colors duration-500 hover:bg-neutral-200">
            Become a Tutor or Mentor
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
            className="rounded-2xl p-5 w-full grid justify-between transition-colors duration-500 hover:bg-neutral-200">
            Volunteer for an Event
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="/connect"
            className="rounded-2xl p-5 w-full grid justify-between transition-colors duration-500 hover:bg-neutral-200">
            Stay Connected
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="https://app.joinhandshake.com/e/806999/jobs"
            className="rounded-2xl p-5 w-full grid justify-between transition-colors duration-500 hover:bg-neutral-200">
            Apply for Emerging Professional
          </ExpressiveLink>
        </li>
      </ul>
    </article>
  );
}
