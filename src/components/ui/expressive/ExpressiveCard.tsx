"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Heading from "../Heading";

interface ExpressiveCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ExpressiveCard({
  title,
  children,
  className = "",
}: ExpressiveCardProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  // Mouse users can click anywhere on the card. The title is a real <button>
  // so keyboard and screen-reader users can reach and toggle it too: pressing
  // Enter or Space fires a click on the button, which bubbles up to the card.
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`${
        open ? "bg-neutral-100" : "bg-neutral-50"
      } hover:bg-neutral-100 flex flex-col rounded-2xl shadow-sm overflow-hidden h-fit p-5 text-neutral-950 transition-colors duration-750 cursor-pointer`}>
      <div className="flex justify-between items-center text-primary-700">
        <Heading>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={contentId}
            className="text-left uppercase cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500">
            {title}
          </button>
        </Heading>
        <ChevronDownIcon
          aria-hidden="true"
          className={`size-5 transition-transform duration-750 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>
      <div
        id={contentId}
        inert={!open}
        className={`${
          open ? "max-h-[200vh] mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"
        } overflow-hidden transition-all duration-750 ${className}`}>
        {children}
      </div>
    </div>
  );
}
