import { useState } from "react";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";
import { HomeSection } from "../HomePage";

import Carousel from "../../../components/ui/Carousel";

export default function HomePublicationsSection() {
  const total = 5;

  return (
    <HomeSection>
      <div className="grid grid-flow-row w-full md:grid-cols-[1fr_1fr] items-center gap-5">
        <article className="grid gap-5 justify-items-start">
          <HighlightedText className="w-fit self-center md:self-auto">
            <h2 className="w-fit font-urbanist text-xxlg font-semibold">
              LATEST UPDATES
            </h2>
          </HighlightedText>
          <p className="text-left text-balance">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <button className="w-fit text-neutral-600">
            <ExpressiveLink className="text-sm" to="">
              LEARN MORE
            </ExpressiveLink>
          </button>
        </article>
        <Carousel className="h-full border-t-2 md:border-t-0 md:border-l-2 w-full  py-5 md:pl-10 border-neutral-400">
          {Array.from({ length: total }).map((_, i) => (
            <CarouselImage key={i} src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" alt="" date={new Date()}/>
          ))}
        </Carousel>
      </div>
    </HomeSection>
  );
}

function CarouselImage({ src, alt, date }) {
  return (
    <div className="relative h-full w-full">
      <img
        className="w-full h-full z-10 aspect-[16/9] bg-accent-900 rounded-2xl object-center object-cover"
        src={src}
        alt={alt}
      />
      <p className="absolute top-2 left-2 z-20 bg-accent-600 rounded-2xl px-2 text-sm text-neutral-50 w-fit">
        {date.toLocaleString("default", { month: "short" })} {date.getDay()},{" "}
        {date.getFullYear()}
      </p>
    </div>
  );
}
