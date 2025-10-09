import { AboutSection } from "../AboutPage";

import { ArrowRightIcon } from "@heroicons/react/20/solid";

import Carousel from "../../../components/ui/Carousel";

export default function AboutTeamSection() {
  return (
    <AboutSection>
      <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
        Meet Our Team
      </h2>
      <div className="grid gap-5">
        <h3 className="justify-self-center">Executive Board</h3>
        <Carousel>
          <CarouselCard
            name="John Doe"
            title="title"
            caption="caption"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
          <CarouselCard
            name="John Doe"
            title="title"
            caption="caption"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
          <CarouselCard
            name="John Doe"
            title="title"
            caption="caption"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
          <CarouselCard
            name="John Doe"
            title="title"
            caption="caption"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
          <CarouselCard
            name="John Doe"
            title="title"
            caption="caption"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
        </Carousel>
      </div>
    </AboutSection>
  );
}

function CarouselCard({ src, name, title, href, caption }) {
  return (
    <a
      href={href}
      className="
        relative h-full
        shrink-0
        flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]
        group overflow-hidden rounded-xl text-accent-background aspect-square
      "
    >
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
      <div className="absolute right-5 top-5 p-1 rounded-4xl bg-black/70 h-fit w-fit text-neutral-50">
        <ArrowRightIcon className="w-[1em] h-[1em] transition-transform duration-750 group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </a>
  );
}
