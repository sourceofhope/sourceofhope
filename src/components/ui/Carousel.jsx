import { useState, useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { Fragment } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Carousel({
  children = [],
  className,
  controls = true,
  auto = false,
}) {
  const containerReference = useRef(null);
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(1);
  const resizeObserverReference = useRef(null);

  const childArray = Array.isArray(children) ? children : [children];

  useLayoutEffect(() => {
    const update = () => {
      const containerWidth = containerReference.current.offsetWidth;
      const firstChild = containerReference.current.children[0];
      const childWidth = firstChild ? firstChild.offsetWidth : containerWidth;
      const fit = Math.max(1, Math.round(containerWidth / childWidth));
      setCount(fit);
      setActive(0);
    };

    update();

    if (window.ResizeObserver) {
      resizeObserverReference.current = new ResizeObserver(update);
      resizeObserverReference.current.observe(containerReference.current);
    }

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      if (resizeObserverReference.current) {
        resizeObserverReference.current.disconnect();
      }
    };
  }, [children]);

  const groups = useMemo(() => {
    const groupings = [];
    for (let i = 0; i < childArray.length; i += count) {
      const group = childArray.slice(i, i + count);
      while (group.length < count) {
        group.push(
          <div
            key={`ghost-${i}-${group.length}`}
            className="invisible pointer-events-none aspect-square"
            style={{ width: `${100 / count}%` }}
          />
        );
      }
      groupings.push(group);
    }
    return groupings;
  }, [childArray, count]);

  const total = groups.length;

  useEffect(() => {
    if (auto) {
      const stepper = setInterval(() => {
        setActive((prev) => (prev - 1 + total) % total);
      }, 7500);

      return () => clearInterval(stepper);
    }
  }, [auto, total]);

  return (
    <article className={`flex flex-col gap-5 justify-center ${className}`}>
      <div
        ref={containerReference}
        className="flex flex-row justify-start items-center w-full gap-5 overflow-hidden">
        {groups[active]?.map((child, i) => (
          <Fragment key={i}>{child}</Fragment>
        ))}
      </div>
      {controls ? (
        <div className="grid grid-cols-[1fr_10fr_1fr] md:grid-cols-1 gap-3 justify-self-center w-full">
          <button
            onClick={() => setActive((active - 1 + total) % total)}
            className={`md:hidden p-1 rounded-full w-fit h-fit text-neutral-50 ${
              groups.length === 1 ? "bg-black/20" : "bg-black/70"
            }`}>
            <ChevronLeftIcon className="w-[20px] h-[20px] hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex flex-row items-center justify-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <CarouselSelector
                key={i}
                selected={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <button
            onClick={() => setActive((active + 1) % total)}
            className={`md:hidden p-1 rounded-full w-fit h-fit text-neutral-50 ${
              groups.length === 1 ? "bg-black/20" : "bg-black/70"
            }`}>
            <ChevronRightIcon className="w-[20px] h-[20px] hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      ) : null}
    </article>
  );
}

function CarouselSelector({ selected, onClick }) {
  return (
    <button
      className={`${
        selected ? "w-20 bg-accent-500" : "w-3 md:w-5 bg-accent-600"
      } h-3 md:h-5 rounded-full transition-[width_color] duration-500`}
      onClick={onClick}></button>
  );
}
