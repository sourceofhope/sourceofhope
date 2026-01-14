import { Helmet } from "react-helmet";
import { useSetHeaderBlocking } from "../../../components/structure/Header";
import { useEffect } from "react";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import { ASSET_VERSION, CANONICAL_URL } from "../../../routes";
import { AnchorButton } from "../../../components/ui/Button";
import Carousel from "../../../components/ui/Carousel";
import Icon from "../../../components/ui/Icon";
import {
  AcademicCapIcon,
  GlobeAmericasIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

export default function ServingHopeProgram() {
  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);
  return (
    <>
      <Helmet>
        <title>Serving Hope & Sharing Hope | The Source of Hope</title>
        <meta
          name="description"
          content="Support The Source of Hope through our Serving Hope and Sharing Hope programs. Join us every 4th Friday & Saturday to prepare, package, and serve meals to the homeless, elderly, and families in need across Dallas–Fort Worth."
        />
        <link rel="canonical" href={CANONICAL_URL.servingHope} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.servingHope} />
        <meta
          property="og:title"
          content="Serving Hope & Sharing Hope | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Be part of Serving Hope and Sharing Hope—monthly community outreach programs providing hot meals, support, and compassion to the homeless and families in need throughout DFW. Volunteer and make an impact."
        />
        <meta
          property="og:image"
          content="https://sourceofhope.org/assets/social-share-serving-hope.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.servingHope} />
        <meta
          name="twitter:title"
          content="Serving Hope & Sharing Hope | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Join our mission to serve the homeless and families in need through The Source of Hope’s Serving Hope & Sharing Hope programs. Volunteer for meal prep, cooking, and community service each month."
        />
        <meta
          name="twitter:image"
          content="https://sourceofhope.org/assets/social-share-serving-hope.jpg"
        />
      </Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <div className="grid gap-3 justify-self-start justify-start">
          <Title>Serving & Sharing Hope</Title>
          <Heading>Monthly Feeding with Dignity</Heading>
        </div>
        <article className="grid gap-5">
          <p>
            <strong className="font-semibold">Serving Hope</strong> and{" "}
            <strong className="font-semibold">Sharing Hope</strong> are two
            cornerstone programs at The Source of Hope, working together to
            fight hunger and support vulnerable communities across the DFW area.
            Whether it's through nourishing meals or distributing donated food
            to partner organizations, these programs aim to spread compassion,
            dignity, and hope.
          </p>
          <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
            <Heading className="bold tracking-wide border-b-2 border-neutral-300 pb-2">
              Why Volunteer With Us?
            </Heading>
            <ul className="grid gap-1">
              <li className="flex flex-row items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <HeartIcon />
                </Icon>
                <p>Make a real difference in your community</p>
              </li>
              <li className="flex flex-row items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <UserIcon />
                </Icon>
                <p>
                  Support hunger relief through Serving Hope and Sharing Hope
                </p>
              </li>
              <li className="flex flex-row items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <AcademicCapIcon />
                </Icon>
                <p>Gain valuable experience while giving back</p>
              </li>
              <li className="flex flex-row items-center gap-3">
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
            className="md:hidden"
          />
        </article>
        <article className="grid gap-5">
          <Title>What Is The Program?</Title>
          <p>
            Serving Hope is a volunteer-driven initiative dedicated to serving
            organic, home-cooked meals to those in need—homeless individuals,
            veterans, nursing home residents, and at-risk families throughout
            the Dallas-Fort Worth community. Each event provides fresh, holistic
            meals that nourish both the body and spirit.
          </p>
        </article>
        <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
          <Heading className=" border-b-2 border-neutral-300 pb-2">
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
            Every fourth weekend of the month, we gather in locations across
            South Dallas and Collin County to offer food, clothing, haircuts,
            and hygiene services. Visit our Volunteer Page to get involved.
          </p>
          <p>
            Sharing Hope began when generous food donations exceeded our
            immediate needs. Now, The Source of Hope collaborates with more than
            fifty nonprofits to share surplus food across the region. This helps
            reduce food waste and support families struggling with food
            insecurity. Students can also earn volunteer hours by donating
            select items. Ask your school counselor for details!
          </p>
        </article>

        <article className="grid gap-5">
          <Title>See our Community Impact</Title>
          <div className="grid grid-flow-row md:grid-cols-[6fr_3fr] gap-5 items-center">
            <div className="grid gap-5 row-start-2 md:row-start-auto">
              <p>
                This recap from our January 2025 Serving Hope for Hunger event
                captures the heart of what we do—bringing people together
                through compassion, service, and community care. From preparing
                home-cooked meals to serving each guest with dignity and a
                smile, our volunteers showed what it truly means to nourish both
                body and soul.
              </p>
              <p>
                Every shared meal represents more than food—it's a reminder that
                hope grows stronger when we serve side by side. Together, we're
                building a community filled with kindness, connection, and
                purpose.
              </p>
              <AnchorButton
                full
                text="REGISTER NOW"
                href="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
              />
            </div>
            <div className="space-y-3 justify-self-end w-full">
              <Carousel
                hideControls
                auto
                className="rounded-2xl object-cover w-full aspect-square">
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
                <CarouselCard
                  src={`/${ASSET_VERSION}/servingHope/Carousel-10.webp`}
                />
              </Carousel>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

function CarouselCard({ src, alt }) {
  return (
    <div
      className="
    relative h-full
    group overflow-hidden rounded-2xl text-accent-background aspect-square
  ">
      <img
        src={src}
        alt={alt}
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
