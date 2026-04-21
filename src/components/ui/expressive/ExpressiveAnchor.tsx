"use client";

import { ReactNode } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

interface ExpressiveAnchorProps {
  children: ReactNode;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  inText?: boolean;
}

export default function ExpressiveAnchor({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
  ariaLabel,
  inText = false,
}: ExpressiveAnchorProps) {
  return (
    <a
      aria-label={ariaLabel}
      href={href}
      target={target}
      rel={rel}
      className={`${
        inText ? "w-fit mr-1" : "w-full"
      } no-underline! text-sm md:text-md group inline-flex justify-between items-center gap-1 focus:outline-none ${className}`}>
      <span>{children}</span>
      <ArrowUpRightIcon
        className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
        aria-hidden="true"
      />
    </a>
  );
}
