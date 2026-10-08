"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

type BaseGalleryItem = {
  alt: string;
  year: string;
  title: string;
  position: string;
};

export type SingleGalleryItem = BaseGalleryItem & {
  src: string;
  flip?: false;
};

export type FlipGalleryItem = BaseGalleryItem & {
  frontSrc: string;
  backSrc: string;
  backAlt?: string;
  backTitle?: string;
  backYear?: string;
  backPosition?: string;
  containBack?: boolean;
  flip: true;
};

export type GalleryItem = SingleGalleryItem | FlipGalleryItem;

const IMAGE_SIZES = "(max-width: 768px) 100vw, 50vw";

function Caption({ year, title }: { year: string; title: string }) {
  return (
    <figcaption className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-linear-to-t from-primary-900/90 via-primary-900/25 to-transparent text-neutral-50">
      <div className="text-xs font-bold tracking-widest text-accent-300 uppercase">
        {year}
      </div>
      <p className="text-sm font-semibold mt-1 leading-snug">{title}</p>
    </figcaption>
  );
}

export default function AwardsGalleryCard({ item }: { item: GalleryItem }) {
  if (!item.flip) {
    return (
      <figure className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-sm bg-primary-900">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={IMAGE_SIZES}
          className="object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none"
          style={{ objectPosition: item.position }}
        />
        <Caption year={item.year} title={item.title} />
      </figure>
    );
  }

  return <FlipCard item={item} />;
}

/** Two-sided photo card: flips on hover (desktop) or tap/Enter (touch, keyboard). */
function FlipCard({ item }: { item: FlipGalleryItem }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={`${item.title} — show ${flipped ? "first" : "second"} photo`}
      className="group relative block w-full aspect-4/3 perspective-[1200px] text-left rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-300">
      <div
        className={`absolute inset-0 transition-transform duration-700 transform-3d motion-reduce:transition-none ${
          flipped
            ? "rotate-y-180"
            : "md:group-hover:rotate-y-180"
        }`}>
        <figure className="absolute inset-0 rounded-2xl overflow-hidden shadow-sm bg-primary-900 backface-hidden">
          <Image
            src={item.frontSrc}
            alt={item.alt}
            fill
            sizes={IMAGE_SIZES}
            className="object-cover"
            style={{ objectPosition: item.position }}
          />
          <span className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-primary-900/70 backdrop-blur-sm text-neutral-50 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-neutral-50/20">
            <ArrowPathIcon className="w-3.5 h-3.5" aria-hidden="true" />
            Tap or hover · 2 photos
          </span>
          <Caption year={item.year} title={item.title} />
        </figure>

        <figure className="absolute inset-0 rounded-2xl overflow-hidden shadow-sm bg-primary-900 backface-hidden rotate-y-180">
          <Image
            src={item.backSrc}
            alt={item.backAlt ?? item.alt}
            fill
            sizes={IMAGE_SIZES}
            className={item.containBack ? "object-contain" : "object-cover"}
            style={{ objectPosition: item.backPosition }}
          />
          <Caption
            year={item.backYear ?? item.year}
            title={item.backTitle ?? item.title}
          />
        </figure>
      </div>
    </button>
  );
}
