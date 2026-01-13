import { NavLink } from "react-router-dom";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";

export function AnchorButton({ text, href, className = "", full = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={text}
      className={`
        !no-underline group inline-flex items-center
        rounded-2xl px-10 py-5
        bg-accent-500 hover:bg-accent-600
        transition-all duration-700 font-semibold text-neutral-50
        ${full ? "w-full" : "w-auto"}
        ${className}
      `}>
      <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
        <span>{text}</span>
        <ArrowUpRightIcon className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
    </a>
  );
}

export function LinkButton({ text, to, className = "", full = false }) {
  return (
    <NavLink
      to={to}
      aria-label={text}
      className={`
        !no-underline group inline-flex items-center
        rounded-2xl px-10 py-5
        bg-accent-500 hover:bg-accent-600
        transition-all duration-700 font-semibold text-neutral-50
        ${full ? "w-full" : "w-auto"}
        ${className}
      `}>
      <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
        <span>{text}</span>
        <ArrowRightIcon className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1" />
      </span>
    </NavLink>
  );
}
