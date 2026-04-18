import { Metadata } from "next";
import Carousel from "@/components/ui/Carousel";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import ExpressiveCard from "@/components/ui/ExpressiveCard";
import Blockquote from "@/components/ui/Blockquote";
import Bold from "@/components/ui/Bold";
import ExpressiveAnchor from "@/components/ui/ExpressiveAnchor";
import HighlightedText from "@/components/ui/HighlightedText";
import Block from "@/components/layout/Block";
import { ASSET_VERSION } from "@/lib/environment";

const CANONICAL_URL = "https://thesourceofhope.org/serve/outdoor-hope";

export const metadata: Metadata = {
  title: "Hope for the Great Outdoors Program | The Source of Hope",
  description:
    "Discover The Source of Hope's Hope for the Great Outdoors Program—connecting youth and families with nature through camping, fishing, hunting, survival skills, and outdoor education. Building confidence, leadership, and respect for the environment.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Hope for the Great Outdoors Program | The Source of Hope",
    description:
      "Join Hope for the Great Outdoors—an outdoor education and leadership program offering camping, fishing, hunting, survival skills, and environmental stewardship experiences for youth and families.",
    siteName: "The Source of Hope",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope for the Great Outdoors Program | The Source of Hope",
    description:
      "Experience nature with purpose through The Source of Hope's Hope for the Great Outdoors Program—teaching life skills, confidence, leadership, and environmental stewardship through outdoor adventures.",
  },
};

function CarouselCard({
  src = `/${ASSET_VERSION}/core/TSOH-Family.webp`,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <button
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
            Hope for The Great Outdoors
          </p>
          <p className="text-lg font-bold">Empowering exploration.</p>
        </div>
      </div>
    </button>
  );
}

export default function OutdoorHope() {
  return (
    <>
      <Block />
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <article className="grid gap-3 justify-self-start justify-start">
          <Title>Hope For The Outdoors</Title>
          <Heading>Teaching our Community</Heading>
        </article>
        <article className="grid gap-5">
          <p>
            At <Bold>The Source of Hope</Bold>, we are excited to introduce{" "}
            <Bold>Hope for the Great Outdoors</Bold>, a program dedicated to
            bringing{" "}
            <HighlightedText>
              outdoor experiences and education to our community
            </HighlightedText>
            . Many individuals, especially those from urban backgrounds, may
            never have had the opportunity to explore nature. Our initiative
            aims to bridge that gap by offering{" "}
            <Bold>
              hands-on learning and immersive outdoor experiences in a safe
            </Bold>
            , inclusive, and supportive environment.
          </p>
          <p>
            Led by our founder, Wesley Stone, a retired wildlife biologist, this
            program provides valuable education on camping, fishing, hunting,
            and outdoor survival skills. Whether you&apos;re a beginner or an
            outdoor enthusiast, this initiative is designed to inspire
            confidence in nature while fostering a{" "}
            <Bold>deep respect for wildlife and the environment.</Bold>
          </p>
          <p>
            Email us at{" "}
            <a
              href="mailto:info@thesourceofhope.org"
              className="text-accent-500">
              info@thesourceofhope.org
            </a>{" "}
            to get involved.
          </p>
        </article>
        <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-5 w-full">
          <Heading className="border-b-2 border-neutral-300 pb-2">
            Get Involved
          </Heading>
          <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
            <span className="font-medium">Volunteer</span>
            <span className="text-neutral-600">
              Help us organize and lead outdoor activities, no experience
              required, just a passion for nature and community
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
            <span className="font-medium">Sponsor</span>
            <span className="text-neutral-600">
              Support our mission by providing funding or outdoor gear to make
              these experiences accessible to more people
            </span>
          </div>
        </article>
        <article className="grid gap-5">
          <Title>What We Offer</Title>
          <p>
            Our approach to responsible hunting ensures that participants
            understand the ethics of conservation, hunting only for sustenance,
            following proper harvesting techniques, and respecting wildlife
            habitats.
          </p>
          <ExpressiveCard title="Outdoor Skills Training">
            <p>
              Learn essential survival techniques, including fire-building,
              shelter construction, and navigation
            </p>
          </ExpressiveCard>
          <ExpressiveCard title="Hunting & Conservation Education">
            <p>
              Gain hands-on experience with bow and arrow training, hunting
              calendars, and firearm safety classes
            </p>
          </ExpressiveCard>
          <ExpressiveCard title="Fishing & Wildlife Exploration">
            <p>
              Discover fishing techniques, responsible angling, and an
              understanding of local ecosystems
            </p>
          </ExpressiveCard>
          <ExpressiveCard title="Annual Community Camping Trip">
            <p>
              A tradition that brings together The Source of Hope family for
              bonding, learning, and adventure
            </p>
          </ExpressiveCard>
        </article>
        <article className="grid gap-5">
          <Title>Program Benefits</Title>
          <div className="grid grid-flow-row md:grid-cols-[6fr_3fr] gap-5 items-center">
            <div className="flex flex-col gap-5 col-start-auto md:col-start-1">
              <p>
                Wesley will guide the community through proper hunting
                practices, including bow and arrow education, hunting calendars,
                and gun safety classes. We place a strong emphasis on
                responsible hunting, as it is crucial for us to respect and
                <HighlightedText>
                  preserve our natural environment
                </HighlightedText>
                . Participants will learn the importance of harvesting animals
                correctly and only hunting what they eat.
              </p>
              <Blockquote className="border-accent-600">
                Interested in safe gun handling or who would like to improve
                their skills? Check out{" "}
                <ExpressiveAnchor
                  inText
                  className="text-accent-500 text-sm md:text-md lg:text-lg"
                  href="https://texasgunsafety.com/about/">
                  Texas Gun Safety
                </ExpressiveAnchor>
                to learn more about how to operate a firearm carefully!
              </Blockquote>
              <p>
                We&apos;ll bring <Bold>The Source of Hope</Bold> family together
                for an annual camping trip each year, offering a unique chance
                to
                <HighlightedText>bond and learn!</HighlightedText>
              </p>
            </div>
            <Carousel hideControls auto>
              <CarouselCard
                src={`/${ASSET_VERSION}/outdoorHope/OH-Carousel-1.webp`}
              />
              <CarouselCard
                src={`/${ASSET_VERSION}/outdoorHope/OH-Carousel-2.webp`}
              />
              <CarouselCard
                src={`/${ASSET_VERSION}/outdoorHope/OH-Carousel-3.webp`}
              />
              <CarouselCard
                src={`/${ASSET_VERSION}/outdoorHope/OH-Carousel-4.webp`}
              />
              <CarouselCard
                src={`/${ASSET_VERSION}/outdoorHope/OH-Carousel-5.webp`}
              />
            </Carousel>
          </div>
        </article>
      </section>
    </>
  );
}
