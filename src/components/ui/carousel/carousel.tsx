"use client";

import { Children, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  Carousel as SdkCarousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel";
import { useTranslations } from "next-intl";
import { buttonStyles } from "../button/button.styles";
import { focusRing, tv } from "../lib/tv";

const carouselStyles = tv({
  slots: {
    root: "flex flex-col gap-4",
    viewport: "rounded-lg scrollbar-none",
    content: "flex gap-4",
    item: "min-w-0 basis-full",
    controls: "flex items-center justify-between gap-4",
    arrows: "flex gap-2",
    arrow: "data-disabled:cursor-not-allowed data-disabled:opacity-40",
    dots: "flex flex-wrap items-center gap-1",
    dot: [
      "grid size-11 place-items-center rounded-full",
      "after:size-2.5 after:rounded-full after:bg-line after:transition-colors data-selected:after:bg-action motion-reduce:after:transition-none",
      focusRing.default,
    ],
  },
});

export type CarouselProps = {
  /** Names the carousel for screen readers, e.g. "Photos from the 2025 Back to School Bash". */
  label: string;
  /** One child per slide. */
  children: ReactNode;
};

/**
 * Carousel: page through photos or stories by hand, one at a time. It never rotates on its
 * own (spec §7.6). Swipe, the arrows, the dots or the arrow keys move it.
 */
export function Carousel({ label, children }: CarouselProps) {
  const t = useTranslations("UI");
  const s = carouselStyles();
  const slides = Children.toArray(children);
  return (
    <SdkCarousel aria-label={label} className={s.root()}>
      <CarouselViewport className={s.viewport()}>
        <CarouselContent className={s.content()}>
          {slides.map((slide, index) => (
            // Slides are static children; their order is their identity.
            <CarouselItem key={index} className={s.item()}>
              {slide}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div className={s.controls()}>
        <CarouselIndicatorGroup aria-label={label} className={s.dots()}>
          {slides.map((_, index) => (
            <CarouselIndicator key={index} page={index + 1} aria-label={t("slideOf", { current: index + 1, total: slides.length })} className={s.dot()} />
          ))}
        </CarouselIndicatorGroup>
        <div className={s.arrows()}>
          <CarouselPrevious aria-label={t("previousSlide")} className={buttonStyles({ variant: "secondary", iconOnly: true, class: s.arrow() })}>
            <ChevronLeftIcon aria-hidden="true" />
          </CarouselPrevious>
          <CarouselNext aria-label={t("nextSlide")} className={buttonStyles({ variant: "secondary", iconOnly: true, class: s.arrow() })}>
            <ChevronRightIcon aria-hidden="true" />
          </CarouselNext>
        </div>
      </div>
    </SdkCarousel>
  );
}
