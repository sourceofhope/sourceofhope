"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface CarouselProps {
  children: React.ReactNode;
  auto?: boolean;
  showProgress?: boolean;
  hideControls?: boolean;
  itemsPerView?: {
    base: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

export default function Carousel({
  children,
  auto = false,
  showProgress = false,
  hideControls = false,
  itemsPerView = { base: 1, md: 1, lg: 1 },
  className = "",
}: CarouselProps) {
  const slides = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child) => typeof child !== "string",
      ),
    [children],
  );

  const [perView, setPerView] = useState(itemsPerView.base);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      if (width >= 1024 && itemsPerView.lg) {
        setPerView(itemsPerView.lg);
      } else if (width >= 768 && itemsPerView.md) {
        setPerView(itemsPerView.md);
      } else {
        setPerView(itemsPerView.base);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [itemsPerView]);

  const totalPages = Math.max(1, Math.ceil(slides.length / perView));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    if (!auto || totalPages <= 1) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % totalPages);
    }, 5000);

    return () => window.clearInterval(id);
  }, [auto, totalPages]);

  const next = () => setIndex((current) => (current + 1) % totalPages);
  const prev = () =>
    setIndex((current) => (current - 1 + totalPages) % totalPages);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}>
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="grid w-full shrink-0 gap-5 px-1"
              style={{
                gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))`,
              }}>
              {slides
                .slice(pageIndex * perView, pageIndex * perView + perView)
                .map((child, childIndex) => (
                  <div key={childIndex} className="h-full w-full">
                    {child}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {(!hideControls || showProgress) && (
        <div className="mt-5 flex items-center justify-between gap-4">
          {!hideControls ? (
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="rounded-full border border-neutral-300 bg-white p-2 text-neutral-800 shadow-sm transition hover:bg-neutral-100">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          ) : (
            <div />
          )}

          {showProgress && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-300">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all duration-500"
                  style={{ width: `${((index + 1) / totalPages) * 100}%` }}
                />
              </div>
              <p className="text-sm text-neutral-600">
                {index + 1} / {totalPages}
              </p>
            </div>
          )}

          {!hideControls ? (
            <button
              onClick={next}
              aria-label="Next slide"
              className="rounded-full border border-neutral-300 bg-white p-2 text-neutral-800 shadow-sm transition hover:bg-neutral-100">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
