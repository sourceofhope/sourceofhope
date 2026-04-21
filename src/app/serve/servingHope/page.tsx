import { Metadata } from "next";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import { AnchorButton } from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import Icon from "@/components/ui/Icon";
import Bold from "@/components/ui/Bold";
import HighlightedText from "@/components/ui/HighlightedText";
import {
  HeartIcon,
  UserIcon,
  AcademicCapIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/20/solid";
import Block from "@/components/layout/Block";
import { ASSET_VERSION } from "@/lib/environment";

const CANONICAL_URL = "https://thesourceofhope.org/serve/serving-hope";

export const metadata: Metadata = {
  title: "Serving Hope & Sharing Hope | The Source of Hope",
  description:
    "Support The Source of Hope through our Serving Hope and Sharing Hope programs. Join us every 4th Friday & Saturday to prepare, package, and serve meals to the homeless, elderly, and families in need across Dallas–Fort Worth.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Serving & Sharing Hope | The Source of Hope",
    description:
      "Be part of Serving Hope and Sharing Hope—monthly community outreach programs providing hot meals, support, and compassion to the homeless and families in need throughout DFW. Volunteer and make an impact.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Serving & Sharing Hope | The Source of Hope",
    description:
      "Join our mission to serve the homeless and families in need through The Source of Hope's Serving Hope & Sharing Hope programs. Volunteer for meal prep, cooking, and community service each month.",
  },
};

export default function ServingHope() {
  return (
    <>
      <Block />
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <div className="grid gap-3 justify-self-start justify-start">
          <Title>Serving & Sharing Hope</Title>
          <Heading>Monthly Feeding with Dignity</Heading>
        </div>

        <article className="grid gap-5">
          <p>
            <Bold>Serving Hope</Bold> and <Bold>Sharing Hope</Bold> are two
            cornerstone programs at <Bold>The Source of Hope</Bold>, working
            together to fight hunger and support{" "}
            <HighlightedText>
              vulnerable communities across the DFW area
            </HighlightedText>
            . Whether it&apos;s through nourishing meals or distributing donated
            food to partner organizations, these programs aim to spread
            compassion, dignity, and hope.
          </p>

          <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
            <Heading className="border-b-2 border-neutral-300 pb-2">
              Why Volunteer With Us?
            </Heading>
            <ul className="grid gap-1">
              <li className="flex flex-row md:items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <HeartIcon />
                </Icon>
                <p>Make a real difference in your community</p>
              </li>
              <li className="flex flex-row md:items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <UserIcon />
                </Icon>
                <p>
                  Support hunger relief through Serving Hope and Sharing Hope
                </p>
              </li>
              <li className="flex flex-row md:items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <AcademicCapIcon />
                </Icon>
                <p>Gain valuable experience while giving back</p>
              </li>
              <li className="flex flex-row md:items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <GlobeAmericasIcon />
                </Icon>
                <p>
                  Be part of a growing network of compassion-driven individuals
                </p>
              </li>
            </ul>
          </article>

          <AnchorButton
            text="SIGN UP"
            href="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
            className="md:hidden w-fit"
          />
        </article>

        <article className="grid gap-5">
          <Title>What Is The Program?</Title>
          <p>
            <Bold>Serving Hope</Bold> is a volunteer-driven initiative dedicated
            to serving organic, home-cooked meals to those in need, homeless
            individuals, veterans, nursing home residents, and at-risk families
            throughout the Dallas-Fort Worth community. Each event provides
            fresh, holistic meals that{" "}
            <HighlightedText>nourish both the body and spirit</HighlightedText>.
          </p>
        </article>

        <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
          <Heading className="border-b-2 border-neutral-300 pb-2">
            Volunteer Feeding Times
          </Heading>
          <div className="grid gap-1">
            <div className="flex justify-between">
              <span>Friday</span>
              <span>10:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span>6:00 AM - 1:00 PM</span>
            </div>
          </div>
        </article>

        <article className="grid gap-5">
          <p>
            <Bold>Every fourth weekend of the month</Bold>, we gather in
            locations across South Dallas and Collin County to offer food,
            clothing, haircuts, and hygiene services. Register today to get
            involved.
          </p>
          <p>
            <Bold>Sharing Hope</Bold> began when generous food donations
            exceeded our immediate needs. Now, The Source of Hope collaborates
            with <HighlightedText>more than fifty nonprofits</HighlightedText>{" "}
            to share surplus food across the region. This helps reduce food
            waste and support families struggling with food insecurity. Students
            can also earn volunteer hours by donating select items. Ask your
            school counselor for details!
          </p>
        </article>

        <article className="grid gap-5">
          <Title>See our Community Impact</Title>
          <div className="grid grid-flow-row md:grid-cols-[6fr_3fr] gap-5 items-center">
            <div className="grid gap-5 row-start-2 md:row-start-auto">
              <p>
                This recap from our <Bold>January 2025 Serving Hope</Bold> for
                Hunger event captures the heart of what we do: bringing people
                together through compassion, service, and community care. From
                preparing home-cooked meals to serving each guest with dignity
                and a smile, our volunteers showed what it truly means to
                nourish both body and soul.
              </p>
              <p>
                Every shared meal represents more than food, it&apos;s a
                reminder that hope grows stronger when we serve side by side.
                Together, we&apos;re building a community filled with kindness,
                connection, and purpose.
              </p>
              <AnchorButton
                text="REGISTER NOW"
                href="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
              />
            </div>
            <div className="space-y-3 justify-self-end w-full">
              <div className="rounded-2xl object-cover w-full aspect-square overflow-hidden">
                <Carousel hideControls auto>
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-1.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-2.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-3.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-4.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-5.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-6.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-7.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-8.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/servingHope/Carousel-9.webp`}
                  />
                </Carousel>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

function CarouselCard({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="relative h-full group overflow-hidden rounded-2xl text-accent-background aspect-square">
      <img
        src={src}
        alt={alt || "Serving Hope"}
        className="w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
      <div className="absolute bottom-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl h-[60%] w-full text-left">
        <div className="absolute bottom-0 w-full p-5 text-neutral-50">
          <p className="text-sm uppercase font-semibold">
            Serving & Sharing Hope
          </p>
          <p className="text-lg font-bold">Giving In Our Community</p>
        </div>
      </div>
    </div>
  );
}
