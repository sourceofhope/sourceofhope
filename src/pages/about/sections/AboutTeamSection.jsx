import { useState } from "react";

import { AboutSection } from "../AboutPage";

import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";

import Carousel from "../../../components/ui/Carousel";

export default function AboutTeamSection() {
  return (
    <AboutSection>
      <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
        Meet Our Team
      </h2>
      <div className="grid gap-5">
        <div className="grid gap-1">
          <h3 className="justify-self-center text-md">Executive Board</h3>
          <Carousel>
            <CarouselCard
              name="Wesley A. Stone"
              title="Chairman"
              caption="Quote Here"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
            <CarouselCard
              name="Quynh Chau Stone"
              title="Co-founder"
              caption="Quote Here"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
          </Carousel>
        </div>
        <div className="grid gap-1">
          <h3 className="justify-self-center text-md">Director Board</h3>
          <Carousel>
            <CarouselCard
              name="Nicole Quynh Stone"
              title="Co-founder & Public Relations Director"
              caption="Quote Here"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
            <CarouselCard
              name="Annelise Quynh Stone"
              title="Director & Mentor"
              caption="Quote Here"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
            <CarouselCard
              name="Clara Montenegro"
              title="Founding Class Member"
              caption="Quote Here"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
          </Carousel>
        </div>
      </div>
    </AboutSection>
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
    fixed inset-0 z-50 flex items-center justify-center
    bg-black/80 md:hidden p-5
    transition-opacity duration-700
    ${
      active
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `}
        onClick={() => setActive(false)}>
        <article className="relative w-full rounded-xl bg-neutral-50 p-5 grid gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{name}</h2>
            <button
              className="justify-self-end text-neutral-50 font-bold p-1 w-fit h-fit bg-neutral-700 rounded-full"
              onClick={() => setActive(false)}>
              <XMarkIcon className="w-[16px] h-[16px]" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm text-neutral-700">{caption}</p>
        </article>
      </section>
    </>
  );
}
