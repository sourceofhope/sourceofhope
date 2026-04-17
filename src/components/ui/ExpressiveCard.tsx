"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Heading from "./Heading";

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

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`${
        open ? "bg-neutral-100" : "bg-neutral-50"
      } hover:bg-neutral-100 flex flex-col rounded-2xl shadow-sm overflow-hidden h-fit p-5 text-neutral-950 transition-colors duration-750 cursor-pointer`}>
      <div className="flex justify-between items-center text-primary-700">
        <Heading className="pointer-events-none">{title}</Heading>
        <ChevronDownIcon
          className={`size-5 transition-transform duration-750 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>
      <div
        className={`${
          open ? "max-h-[200vh] mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"
        } overflow-hidden transition-all duration-750 ${className}`}>
        {children}
      </div>
    </div>
  );
}
