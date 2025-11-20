import { Helmet } from "react-helmet";
import {
  HeaderFlagContext,
  useHeaderFlag,
} from "../../../components/structure/Header";
import { useEffect } from "react";
import Carousel from "../../../components/ui/Carousel";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import ExpressiveCard from "../../../components/ui/expressive/ExpressiveCard";
import Blockquote from "../../../components/ui/text/Blockquote";

export default function EducationHopeProgram() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet></Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <article className="grid gap-3 justify-self-start justify-start">
          <Title>Education for Hope Program</Title>
          <Heading>Teaching our Community</Heading>
        </article>
        <article className="grid gap-5 text-neutral-600">
          <p>
            At The Source of Hope, we are excited to introduce Hope for the
            Great Outdoors, a program dedicated to bringing outdoor experiences
            and education to our community. Many individuals, especially those
            from urban backgrounds, may never have had the opportunity to
            explore nature. Our initiative aims to bridge that gap by offering
            hands-on learning and immersive outdoor experiences in a safe,
            inclusive, and supportive environment.
          </p>
          <p>
            Led by our founder, Wesley Stone, a retired wildlife biologist, this
            program provides valuable education on camping, fishing, hunting,
            and outdoor survival skills. Whether you’re a beginner or an outdoor
            enthusiast, this initiative is designed to inspire confidence in
            nature while fostering a deep respect for wildlife and the
            environment.
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
        <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
          <Heading className=" border-b-2 border-neutral-300 pb-2">
            Get Involved
          </Heading>
          <div className="grid gap-1">
            <div className="grid grid-cols-[2fr_4fr] justify-between">
              <span className="font-medium">Volunteer</span>
              <span>
                Help us organize and lead outdoor activities. No experience
                required, just a passion for nature and community
              </span>
            </div>
            <div className="grid grid-cols-[2fr_4fr] justify-between">
              <span className="font-medium">Sponsor</span>
              <span>
                Support our mission by providing funding or outdoor gear to make
                these experiences accessible to more people
              </span>
            </div>
          </div>
        </article>
        <article className="grid gap-5">
          <Title>What We Offer</Title>
          <p>
            Our approach to responsible hunting ensures that participants
            understand the ethics of conservation—hunting only for sustenance,
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
                preserve our natural environment. Participants will learn the
                importance of harvesting animals correctly and only hunting what
                they eat.
              </p>
              <Blockquote className="border-accent-600">
                Interested in safe gun handling or who would like to improve
                their skills? Check out <strong>Texas Gun Safety</strong> to
                learn more about how to operate a firearm carefully!
              </Blockquote>
              <p>
                We’ll bring The Source of Hope family together for an annual
                camping trip each year, offering a unique chance to bond and
                learn!
              </p>
            </div>
            <div
              className="
          relative h-full w-full group overflow-hidden 
          rounded-xl text-accent-background aspect-square shadow-lg
          col-start-auto md:col-start-2
        ">
              <Carousel
                className="rounded-2xl object-cover w-full aspect-square"
                controls={false}
                auto={true}>
                <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
                <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
                <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
                <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
                <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
              </Carousel>
            </div>
          </div>
        </article>
      </section>
    </HeaderFlagContext.Provider>
  );
}

function CarouselCard({ src, alt }) {
  return (
    <button
      className="
    relative h-full
    shrink-0
    flex-[0_0_calc(100%)] 
    group overflow-hidden rounded-xl text-accent-background aspect-square shadow-lg
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
