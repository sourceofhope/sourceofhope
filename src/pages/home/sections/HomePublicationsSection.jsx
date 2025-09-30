import { useState } from "react";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

export default function HomePublicationsSection() {
  const [active, setActive] = useState(0);
  const total = 5;

  return (
    <section className="my-5 py-5 px-5 lg:px-35 w-full h-full justify-items-center items-center grid gap-5">
      <div className="grid grid-flow-row w-full md:grid-cols-[1fr_1fr] items-center gap-5">
        <article className="flex flex-col gap-5 items-center md:items-start">
					<HighlightedText className="w-fit">
						<h2 className="text-center w-fit font-urbanist text-xxlg md:text-left font-semibold">Latest Updates</h2>
					</HighlightedText>
          <p className="md:text-balance">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </article>
        <article className="flex flex-col gap-5 pt-5 border-t-2 md:border-t-0 md:border-l-2 w-full md:pl-10 border-neutral-400 justify-center">
          {Array.from({ length: total }).map((_, i) => (
            <CarouselImage key={i} selected={i === active} />
          ))}
          <div className="flex flex-row items-center justify-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <CarouselSelector
                key={i}
                selected={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </article>
      </div>
      <button className="justify-self-end md:justify-self-end w-fit text-neutral-600">
        <ExpressiveLink className="text-sm" to="">
          LEARN MORE
        </ExpressiveLink>
      </button>
    </section>
  );
}

function CarouselSelector({ selected, onClick }) {
  return (
    <button
      className={`${
        selected ? "w-1/6 bg-accent-500" : "w-4 bg-neutral-600"
      } h-2 rounded-full  transition-[width_color] duration-500`}
      onClick={onClick}
    ></button>
  );
}

function CarouselImage({ selected }) {
  return (
    <img
      className={`${
        selected ? "block" : "hidden"
      } w-full h-full aspect-[16/9] bg-accent-900 rounded-2xl object-center object-cover`}
    />
  );
}
