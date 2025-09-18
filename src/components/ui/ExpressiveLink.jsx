// ui/ExpressiveLink.jsx
import { NavLink } from "react-router-dom";
import { ArrowUpRightIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

export default function ExpressiveLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className="group inline-flex w-full justify-between items-center gap-1  focus:outline-none"
    >
      <span>{children}</span>
      <ArrowUpRightIcon
        className="w-[1em] h-[1em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        aria-hidden="true"
      />
    </NavLink>
  );
}
