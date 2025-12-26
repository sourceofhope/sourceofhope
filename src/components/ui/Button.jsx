import { NavLink } from "react-router-dom";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";

export function AnchorButton({ text, href, className }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      aria-label={text}
      href={href}
      className={`${className} flex justify-center w-full h-fit rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 duration-750 transition-all font-semibold text-neutral-50`}>
      <div className="w-full">
        <div
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`!no-underline text-sm md:text-md group inline-flex w-full justify-between items-center gap-1 focus:outline-none`}>
          <span>{text}</span>
          <ArrowUpRightIcon
            className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </a>
  );
}

export function LinkButton({ text, to, className }) {
  return (
    <NavLink
      aria-label={text}
      to={to}
      className={`${className} flex justify-center w-full h-fit rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 duration-750 transition-all font-semibold text-neutral-50`}>
      <div className="w-full">
        <div
          className={`!no-underline text-sm md:text-md group inline-flex w-full justify-between items-center gap-1 focus:outline-none`}>
          <span>{text}</span>
          <ArrowRightIcon
            className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </NavLink>
  );
}
