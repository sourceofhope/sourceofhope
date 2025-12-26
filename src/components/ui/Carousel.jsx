import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Carousel({
  children,
  auto = false,
  showProgress = false,
  hideControls = false,
  itemsPerView = { base: 1, md: 1, lg: 1 },
}) {
  const slides = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child) => typeof child !== "string"
      ),
    [children]
  );

  const [perView, setPerView] = useState(itemsPerView.base);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024 && itemsPerView.lg) setPerView(itemsPerView.lg);
      else if (w >= 768 && itemsPerView.md) setPerView(itemsPerView.md);
      else setPerView(itemsPerView.base);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [itemsPerView]);

  const totalPages = Math.max(1, Math.ceil(slides.length / perView));

  useEffect(() => {
    setIndex((i) => Math.min(i, totalPages - 1));
  }, [totalPages]);

  const next = () => setIndex((i) => (i + 1) % totalPages);
  const prev = () => setIndex((i) => (i - 1 + totalPages) % totalPages);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, 7500);
    return () => clearInterval(id);
  }, [auto, totalPages]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{
          width: `${(totalPages * 100) / totalPages}%`,
          transform: `translateX(-${index * 100}%)`,
        }}>
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div
            key={pageIndex}
            className="grid gap-5 px-2 shrink-0"
            style={{
              width: "100%",
              gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))`,
            }}>
            {slides
              .slice(pageIndex * perView, pageIndex * perView + perView)
              .map((child, i) => (
                <div key={i} className="w-full h-full">
                  {child}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="grid grid-flow-col gap-3 w-full items-center justify-between my-5 max-w-full">
        {!hideControls && (
          <button
            onClick={prev}
            className="bg-black/60 text-white p-2 rounded-full">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
        {showProgress && (
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="flex gap-1 justify-center overflow-x-auto scroll-auto pointer-events-none !no-scrollbar px-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-5 shrink-0 rounded-full transition-all duration-300 ${
                    i === index ? "w-10 bg-accent-500" : "w-5 bg-accent-600"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {!hideControls && (
          <button
            onClick={next}
            className="bg-black/60 text-white p-2 rounded-full">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
