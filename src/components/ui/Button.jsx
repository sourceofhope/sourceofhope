import { NavLink } from "react-router-dom";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";

export function AnchorButton({ text, href, className }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={text}
      className={`${className} !no-underline group flex justify-center w-full rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 transition-all duration-700 font-semibold text-neutral-50`}>
      <span className="inline-flex w-full justify-between items-center gap-1 text-sm md:text-md">
        {text}
        <ArrowUpRightIcon
          className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
          aria-hidden="true"
          focusable="false"
        />
      </span>
    </a>
  );
}

export function LinkButton({ text, to, className }) {
  return (
    <NavLink
      to={to}
      aria-label={text}
      className={`${className} !no-underline group flex justify-center w-full rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 transition-all duration-700 font-semibold text-neutral-50`}>
      <span className="inline-flex w-full justify-between items-center gap-1 text-sm md:text-md">
        {text}
        <ArrowRightIcon
          className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1"
          aria-hidden="true"
          focusable="false"
        />
      </span>
    </NavLink>
  );
}
