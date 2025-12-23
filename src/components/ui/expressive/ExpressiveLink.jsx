import { NavLink } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

export default function ExpressiveLink({ ariaLabel, children, className, to }) {
  return (
    <NavLink
      aria-label={ariaLabel}
      to={to}
      className={`!no-underline text-sm md:text-md group inline-flex w-full justify-between items-center gap-1 focus:outline-none ${className}`}>
      <span>{children}</span>
      <ArrowRightIcon
        className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </NavLink>
  );
}
