import { Helmet } from "react-helmet";
import {
  HeaderFlagContext,
  useHeaderFlag,
} from "../../../components/structure/Header";
import { useEffect } from "react";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Carousel from "../../../components/ui/Carousel";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import { ASSET_VERSION, CANONICAL_URL } from "../../../routes";

export default function InternationalHopeProgram() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet>
        <title>Education for Hope Program | The Source of Hope</title>
        <meta
          name="description"
          content="Explore The Source of Hope’s Education for Hope Program, providing virtual tutoring, reading and writing mentorship, and academic support through the TSOH ILA Tutoring Program. Empowering students to excel in literacy, test preparation, and long-term academic success."
        />
        <link rel="canonical" href={CANONICAL_URL.educationHope} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.educationHope} />
        <meta
          property="og:title"
          content="Education for Hope Program | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Join the Education for Hope Program to receive free virtual tutoring and academic mentorship. Students gain support in reading, writing, standardized test prep, and literacy development through the TSOH ILA Tutoring Program."
        />
        <meta
          property="og:image"
          content="https://sourceofhope.org/assets/social-share-education-for-hope.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.educationHope} />
        <meta
          name="twitter:title"
          content="Education for Hope Program | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Access free academic support through The Source of Hope’s Education for Hope Program—offering virtual tutoring, reading and writing mentorship, and test preparation to help students thrive."
        />
        <meta
          name="twitter:image"
          content="https://sourceofhope.org/assets/social-share-education-for-hope.jpg"
        />
      </Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <article className="grid gap-3 justify-self-start justify-start">
          <Title>International Partner Serving Program</Title>
          <Heading>Extends our mission beyond borders</Heading>
        </article>
        <article className="grid gap-3 text-neutral-600">
          <p>
            At The Source of Hope, our mission extends{" "}
            <strong>beyond borders</strong>. We believe that hope has no
            limits—and neither should compassion. Through our International
            Partner Serving initiative, we collaborate with organizations,
            volunteers, and communities across the globe to bring essential
            resources, training, and empowerment to those in need.
          </p>
          <p>
            Whether it's through vocational education, wellness support, or
            humanitarian aid, our international partnerships are built on a
            shared commitment to uplift underserved populations, promote
            self-sufficiency, and create sustainable impact.
          </p>
          <p>Our global work focuses on:</p>
          <ul className="grid gap-2 list-disc pl-5">
            <li className="pl-3 text-balance">
              Empowering vocational students in developing regions through
              scholarships and educational tools.
            </li>
            <li className="pl-3 text-balance">
              Providing beauty and wellness services to restore dignity and
              confidence.
            </li>
            <li className="pl-3 text-balance">
              Facilitating community outreach programs such as food
              distribution, hygiene kits, and mentorship.
            </li>
          </ul>
          <p>
            By fostering international relationships grounded in trust and
            mutual respect, we aim to amplify hope and healing on a global
            scale—one life, one community at a time.
          </p>
          <button className="my-5 md:hidden rounded-2xl p-5 bg-accent-500 md:w-1/3 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
            <ExpressiveAnchor to="">APPLY</ExpressiveAnchor>
          </button>
        </article>
        <article className="grid gap-5">
          <Title>Previous Partner Serving Trips</Title>
          <p>
            We've taken several trips across Southeast Asia and South America,
            exploring different countries, meeting incredible people, and
            learning so much from each place we visited.
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
    </HeaderFlagContext.Provider>
  );
}

function CarouselCard({
  src = `/${ASSET_VERSION}/core/placeholder.webp`,
  alt,
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
