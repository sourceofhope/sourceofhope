'use client';

import { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import Overlay from '@/components/ui/Overlay';
import ExpressiveAnchor from '@/components/ui/ExpressiveAnchor';
import { type SanityDocument } from "next-sanity";

interface TeamMember extends SanityDocument {
  _id: string;
  name: string;
  slug: { current: string };
  title?: string;
  shortBio?: string;
  bio?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
  };
}

interface CarouselCardProps {
  member: TeamMember;
}

export function CarouselCard({ member }: CarouselCardProps) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        onClick={() => setActive(true)}
        className="relative h-full min-h-[320px] w-full group overflow-hidden rounded-2xl aspect-square cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image?.sourceUrl || '/v2/core/Member-Placeholder.webp'}
          alt={member.image?.altText || member.name}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-750 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <Link
          href={`/about/team/${member.slug.current}`}
          className="absolute inset-0 w-full h-full z-50 hidden md:block"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Gradient overlay with text */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl flex flex-col">
          <h2
            className={`md:line-clamp-1 text-md ${
              (member.shortBio ?? member.bio) ? 'lg:group-hover:text-sm' : ''
            } transition-all duration-750 font-semibold text-center text-neutral-50`}
          >
            {member.name}
          </h2>

          <h3
            className={`md:line-clamp-1 text-sm ${
              (member.shortBio ?? member.bio) ? 'lg:group-hover:text-xs' : ''
            } transition-all duration-750 font-semibold text-center text-neutral-300`}
          >
            {member.title}
          </h3>

          <p className="text-sm hidden lg:block text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden transition-[height_opacity] duration-750 group-hover:max-h-70 group-hover:opacity-100">
            {member.shortBio ?? member.bio}
          </p>
        </div>

        {/* Arrow icon */}
        <div className="absolute right-5 top-5 p-1 rounded-full bg-black/70 text-neutral-50">
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-750 group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Mobile Overlay */}
      <Overlay active={active} setActive={setActive}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-neutral-900">
              {member.name}
            </h2>
            <button
              onClick={() => setActive(false)}
              className="rounded-full p-2 hover:bg-neutral-200 transition-colors duration-750"
            >
              <XMarkIcon className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-neutral-600">{member.bio}</p>
          <div className="flex justify-end w-fit">
            <ExpressiveAnchor
              href={`/about/team/${member.slug.current}`}
              className="font-semibold text-accent-700 hover:text-accent-800 transition-colors duration-750"
            >
              See full &apos;{member.name}&apos; Biography
            </ExpressiveAnchor>
          </div>
        </div>
      </Overlay>
    </>
  );
}
