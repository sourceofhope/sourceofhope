import { Helmet } from "react-helmet";
import {
  HeaderFlagContext,
  useHeaderFlag,
} from "../../../components/structure/Header";
import { useEffect } from "react";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import Button from "../../../components/ui/Button";

import { CANONICAL_URL } from "../../../routes";

export default function WellnessHopeProgram() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet>
        <title>Wellness of Hope Program | The Source of Hope</title>
        <meta
          name="description"
          content="Discover The Source of Hope’s Wellness of Hope Program, providing free or reduced-cost holistic treatments—fire cupping, lymphatic drainage, detox therapies, and more—to low-income individuals, seniors, teachers, first responders, and families across Dallas–Fort Worth."
        />
        <link rel="canonical" href={CANONICAL_URL.wellnessHope} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.wellnessHope} />
        <meta
          property="og:title"
          content="Wellness of Hope Program | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Experience compassionate holistic care through the Wellness of Hope Program. We provide reduced-cost wellness treatments—including fire cupping, lymphatic drainage, ear candling, and detox therapies—to seniors, teachers, first responders, and families in need."
        />
        <meta
          property="og:image"
          content="https://sourceofhope.org/assets/social-share-wellness-of-hope.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.wellnessHope} />
        <meta
          name="twitter:title"
          content="Wellness of Hope Program | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Join the Wellness of Hope Program, offering holistic wellness treatments and assessments at reduced cost for low-income individuals, seniors, educators, first responders, and families throughout Dallas–Fort Worth."
        />
        <meta
          name="twitter:image"
          content="https://sourceofhope.org/assets/social-share-wellness-of-hope.jpg"
        />
      </Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <div className="grid gap-3 justify-self-start justify-start">
          <Title>Wellness of Hope </Title>
          <Heading>Free Holistic Clinic Services</Heading>
        </div>
        <article className="grid gap-5">
          <p>
            The Wellness of Hope Clinic provides holistic treatments like fire
            cupping and lymphatic drainage to low-income individuals, including
            senior citizens, teachers, first responders, and others in need. In
            partnership with Stone International Wellness Center, the clinic
            offers both therapeutic and cosmetic services to improve well-being
            and boost confidence. These services make a life-changing impact for
            those who may not otherwise afford such care. The clinic also
            provides reduced cosmetic services and classes to the general
            public.
          </p>
          <p>
            We offer free makeovers to individuals living with HIV/AIDs and low
            income individuals to help improve their self-esteem. Provide FREE
            haircuts to senior citizens 65+, teachers, fire fighters, police
            officers, and veterans every month
          </p>
          <Button text="APPLY" className="block md:hidden" />
        </article>
        <article className="grid gap-5">
          <Title>Our Services</Title>
          <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
            <WellnessShowcaseCard title="FACIAL AND BODY TREATMENTS" />
            <WellnessShowcaseCard title="HAIR SERVICES" />
            <WellnessShowcaseCard title="PERMANENT COSMETICS" />
          </div>
        </article>
        <article className="grid gap-5">
          <Title>Holistic Assessment</Title>

          <div className="grid grid-cols-1 md:grid-cols-[6fr_3fr] gap-5 items-center">
            <div className="flex flex-col gap-5">
              <p>
                The TSOH Community Wellness Program, in partnership with Stone
                International Wellness Center, is proud to offer free or
                reduced-cost holistic treatments for eligible individuals.
                Through this initiative, community members can schedule a
                variety of rotating holistic treatments, updated every fourth
                quarter to better meet evolving needs.
              </p>
              <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
                <Heading className=" border-b-2 border-neutral-300 pb-2">
                  Eligible Individuals
                </Heading>
                <div className="grid gap-1">
                  <div className="flex justify-between">Teachers/Mentors</div>
                  <div className="flex justify-between">Veterans</div>
                  <div className="flex justify-between">First Responders</div>
                  <div className="flex justify-between">Senior Citizens</div>
                </div>
              </article>
              <p>
                We are also excited to provide complimentary holistic
                assessments— previously valued at $250—to help you better
                understand your unique wellness needs. These assessments guide
                you toward the most suitable treatments offered through our
                partnership with StoneIWC, reinforcing our shared commitment to
                supporting the community’s complete well-being.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div
                className="
            relative h-full w-full group overflow-hidden 
            rounded-xl text-accent-background aspect-square shadow-lg
          ">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
                  alt="Holistic wellness care"
                  className="w-full h-full object-cover brightness-[.85] contrast-[1.1]"
                />

                <div className="absolute bottom-0 h-[60%] w-full bg-gradient-to-t from-black/60 to-transparent rounded-xl">
                  <div className="absolute bottom-0 w-full p-5 text-neutral-50">
                    <p className="text-sm uppercase font-semibold">
                      Holistic Wellness
                    </p>
                    <p className="text-lg font-bold">
                      Caring for the whole community
                    </p>
                  </div>
                </div>
              </div>
              <Button text="APPLY" />
            </div>
          </div>
        </article>
        <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
          <Heading className=" border-b-2 border-neutral-300 pb-2">
            Current Available Time Slots
          </Heading>
          <div className="grid gap-1">
            <div className="flex justify-between">
              <span className="font-medium">Monday</span>
              <span>6:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tuesday</span>
              <span>6:00 AM - 2:00 PM</span>
            </div>
          </div>
        </article>
      </section>
    </HeaderFlagContext.Provider>
  );
}

function WellnessShowcaseCard({ title, src, alt }) {
  return (
    <article className="relative w-full">
      <img
        src={src}
        alt={alt}
        className="w-full aspect-square bg-accent-900 rounded-2xl border-4 border-neutral-300"
      />
      <div className="absolute flex bottom-0 p-5 px-10 h-1/4 w-full rounded-b-2xl border-x-4 border-b-4 border-neutral-300 bg-neutral-100 items-center justify-center">
        <h2 className="w-fit h-fit text-balance text-center text-md font-semibold">
          {title}
        </h2>
      </div>
    </article>
  );
}
