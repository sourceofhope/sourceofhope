import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function ExpressiveCard({ title, children, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`${
        open ? "bg-neutral-200" : "bg-neutral-50"
      } hover:bg-neutral-200 flex flex-col rounded-2xl shadow-2x overflow-hidden h-fit p-5 text-neutral-950 transition-colors duration-750`}>
      <div className="flex justify-between items-center text-primary-700">
        <h2 className="text-sm font-bold uppercase">{title}</h2>
        <ChevronDownIcon
          className={`w-[20px] h-[20px] transition-transform duration-750 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>
      <div
        className={`${
          open ? "max-h-screen mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"
        } overflow-hidden transition-all duration-750 ${className}`}>
        {children}
      </div>
    </div>
  );
}
