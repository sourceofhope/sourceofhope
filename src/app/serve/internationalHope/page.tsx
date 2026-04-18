import { Metadata } from "next";
import ExpressiveAnchor from "@/components/ui/ExpressiveAnchor";
import Carousel from "@/components/ui/Carousel";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import Icon from "@/components/ui/Icon";
import {
  GlobeEuropeAfricaIcon,
  HeartIcon,
  LanguageIcon,
} from "@heroicons/react/20/solid";
import Bold from "@/components/ui/Bold";
import HighlightedText from "@/components/ui/HighlightedText";
import Emphasis from "@/components/ui/Emphasis";
import Block from "@/components/layout/Block";
import { ASSET_VERSION } from "@/lib/environment";

const CANONICAL_URL = "https://thesourceofhope.org/serve/international-hope";

export const metadata: Metadata = {
  title: "International Partner Serving Program | The Source of Hope",
  description:
    "Explore The Source of Hope's International Partner Serving Program—extending hope worldwide through global partnerships that provide food, education, medical support, disaster relief, and community development to vulnerable populations.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "International Partner Serving Program | The Source of Hope",
    description:
      "Join The Source of Hope's International Partner Serving Program as we collaborate with global partners to deliver humanitarian aid, education, medical support, and sustainable community development across the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "International Partner Serving Program | The Source of Hope",
    description:
      "Make a global impact through The Source of Hope's International Partner Serving Program—supporting communities worldwide with humanitarian aid, education, health services, and disaster relief.",
  },
};

function CarouselCard({
  src = `/${ASSET_VERSION}/core/placeholder.webp`,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <div
      className="
		relative h-full
		group overflow-hidden rounded-xl text-accent-background aspect-square
	">
      <img
        src={src}
        alt={alt}
        className="inset-0 w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
    </div>
  );
}

export default function InternationalHope() {
  return (
    <>
      <Block />
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <article className="grid gap-3 justify-self-start justify-start">
          <Title>International Partner Serving</Title>
          <Heading>Extends our mission beyond borders</Heading>
        </article>
        <article className="grid gap-3">
          <p>
            At <Bold>The Source of Hope</Bold>,{" "}
            <HighlightedText>
              our mission extends beyond borders
            </HighlightedText>
            . We believe that hope has no limits, and neither should compassion.
            Through our <Bold>International Partner Serving</Bold> initiative,
            we collaborate with organizations, volunteers, and communities
            across the globe to bring essential <Emphasis>resources</Emphasis>,{" "}
            <Emphasis>training</Emphasis>, and <Emphasis>empowerment</Emphasis>{" "}
            to those in need.
          </p>
          <p>
            Whether it&apos;s through vocational education, wellness support, or
            humanitarian aid, our international partnerships are built on a{" "}
            <Bold>shared commitment</Bold> to uplift underserved populations,
            promote self-sufficiency, and create sustainable impact.
          </p>
          <ul className="grid gap-2 list-disc pl-5"></ul>
          <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
            <Heading className="border-b-2 border-neutral-300 pb-2">
              OUR GLOBAL PRIORITIES
            </Heading>
            <ul className="grid gap-1">
              <li className="flex flex-row md:items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <LanguageIcon />
                </Icon>
                <p>
                  Empowering vocational students in developing regions through
                  scholarships and educational tools.
                </p>
              </li>
              <li className="flex flex-row md:items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <HeartIcon />
                </Icon>
                <p>
                  Providing beauty and wellness services to restore dignity and
                  confidence.
                </p>
              </li>
              <li className="flex flex-row md:items-center gap-3">
                <Icon className="text-accent-500 aspect-square h-[1em]">
                  <GlobeEuropeAfricaIcon />
                </Icon>
                <p>
                  Facilitating community outreach programs such as food
                  distribution, hygiene kits, and mentorship.
                </p>
              </li>
            </ul>
          </article>
          <p>
            By fostering international relationships grounded in trust and
            mutual respect, we aim to amplify hope and healing on a global
            scale, one life, one community at a time.
          </p>
          <button className="my-5 md:hidden rounded-2xl p-5 bg-accent-500 md:w-1/3 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
            <ExpressiveAnchor href="">APPLY</ExpressiveAnchor>
          </button>
        </article>
        <article className="grid gap-5">
          <Title>Previous Partner Serving Trips</Title>
          <p>
            We&apos;ve taken several trips across Southeast Asia and South
            America, exploring different countries, meeting incredible people,
            and <Bold>learning so much from each place we visited.</Bold>
          </p>
          <Heading>WINTER 2020 - SOUTHEAST ASIA</Heading>
          <Carousel auto showProgress itemsPerView={{ base: 1, md: 2, lg: 3 }}>
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-1.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-2.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-3.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-4.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-5.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-6.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-7.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/southeastasia/Carousel-8.webp`}
            />
          </Carousel>
          <Heading>SUMMER 2018 - NICARAGUA</Heading>
          <Carousel auto showProgress itemsPerView={{ base: 1, md: 2, lg: 3 }}>
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/nicaragua/Carousel-1.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/nicaragua/Carousel-2.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/nicaragua/Carousel-3.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/nicaragua/Carousel-4.webp`}
            />
            <CarouselCard
              src={`/${ASSET_VERSION}/internationalHope/nicaragua/Carousel-5.webp`}
            />
          </Carousel>
        </article>
      </section>
    </>
  );
}
