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

export default function EducationHopeProgram() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet></Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35">
        <article className="grid gap-1 justify-self-start justify-start">
          <Title>Education for Hope Program</Title>
          <Heading>Teaching our Community</Heading>
        </article>
        <article className="grid gap-3 text-sm md:text-md text-neutral-600">
          <p>
            The Education For Hope program offers tutoring services, supports
            cosmetology students, and provides opportunities through the Federal
            Work-Study program in partnership with The University of Texas at
            Dallas. We assist students of all ages by offering scholarships to
            low-income cosmetology students, facilitating advanced beauty
            education, and hiring for operations roles through Work-Study.
          </p>
          <button className="border-5 justify-self-center rounded-2xl font-bold w-fit shadow-sm hover:shadow-lg shadow-accent-500/70 hover:bg-neutral-50/95 border-accent-500 bg-neutral-50/90 duration-500 text-accent-500 opacity-85 hover:opacity-100 transition-[shadow_colors]">
            <ExpressiveAnchor className="px-10 py-5" to="/sourceofhope/about">
              APPLY
            </ExpressiveAnchor>
          </button>
        </article>
        <article className="grid gap-5">
          <Heading>Holistic Practitioners</Heading>
          <Carousel>
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
          </Carousel>
        </article>
        <article></article>
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
    md:flex-[0_0_calc(50%-0.625rem)] 
    lg:flex-[0_0_calc(33.333%-0.833rem)]
    group overflow-hidden rounded-xl text-accent-background aspect-square
  ">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
    </button>
  );
}
