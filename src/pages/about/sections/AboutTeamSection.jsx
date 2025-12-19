import { useEffect, useState } from "react";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";

import Carousel from "../../../components/ui/Carousel";
import PageSection from "../../PageSection";
import Title from "../../../components/ui/text/Title";

export default function AboutTeamSection() {
  return (
    <PageSection className="pt-5">
      <div className="grid gap-5">
        <CarouselLayer
          title="Boarrd of Executives"
          fetchName="executivesBoard"
        />
        <CarouselLayer title="Board of Directors" fetchName="directorsBoard" />
        <CarouselLayer title="Spring 2024" fetchName="internSpring24" />
        <CarouselLayer title="Fall 2025" fetchName="internFall25" />
        <CarouselLayer title="Summer 2025" fetchName="internSummer25" />
        <CarouselLayer title="Spring 2025" fetchName="internSpring25" />
        <CarouselLayer title="Fall 2024" fetchName="internFall24" />
        <CarouselLayer title="Summer 2024" fetchName="internSummer24" />
        <CarouselLayer title="Spring 2024" fetchName="internSpring24" />
        <CarouselLayer
          title="High School Interns"
          fetchName="internHighschool"
        />
      </div>
    </PageSection>
  );
}

function CarouselLayer({ title, fetchName, options = {} }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent(fetchName, options)
      .then((data) => {
        setPosts(data);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-5">
      <Title>{title}</Title>
      <Carousel>
        {!loading && posts.length === 0 && (
          <p className="w-full text-center text-gray-500">
            No team members to display
          </p>
        )}

        {!loading &&
          posts.map((post) => (
            <CarouselCard
              key={post.id}
              src={post.acf?.hero_image?.url}
              name={post.acf?.memberrName}
              title={post.acf?.memberTitle}
              caption={post.acf?.memberQoute}
            />
          ))}
      </Carousel>
    </div>
  );
}

function CarouselCard({ src, name, title, caption }) {
  const [active, setActive] = useState(false);

  return (
    <>
      <button
        onClick={() => setActive(!active)}
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
          alt={caption}
          className="inset-0 w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
        />
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/90 to-transparent rounded-xl flex flex-col justify-start">
          <h2 className="md:line-clamp-1 text-md lg:group-hover:text-sm duration-750 transition-all font-semibold text-center text-neutral-50">
            {name}
          </h2>
          <h3 className="md:line-clamp-1 text-sm lg:group-hover:text-xs duration-750 transition-all font-semibold text-center text-neutral-300">
            {title}
          </h3>
          <p className="text-sm hidden lg:block text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden transition-[height_opacity] duration-750 text-left group-hover:max-h-70 group-hover:opacity-100">
            {caption}
          </p>
        </div>
        <div className="absolute md:hidden right-5 top-5 p-1 rounded-4xl bg-black/70 h-fit w-fit text-neutral-50">
          <ArrowRightIcon
            className="w-[1em] h-[1em] transition-transform duration-750 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </button>
      <section
        className={`
    fixed inset-0 z-50 left-0 bottom-0 flex items-center justify-center
    bg-black/50 md:hidden p-5
    transition-opacity duration-700 h-screen w-screen
    ${
      active
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `}
        onClick={() => setActive(false)}>
        <article className="relative w-full rounded-xl bg-neutral-200 p-5 grid gap-5">
          <div className="flex justify-between">
            <h2 className="text-md font-semibold uppercase">{name}</h2>
            <button
              className="justify-self-end font-bold p-1 w-fit h-fit  rounded-full"
              onClick={() => setActive(false)}>
              <XMarkIcon className="w-[20px] h-[20px]" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm text-neutral-700">{caption}</p>
        </article>
      </section>
    </>
  );
}
