// ui/ExpressiveLink.jsx
import { NavLink } from "react-router-dom";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

function Arrow() {
  return (
    <ArrowUpRightIcon
      className="w-[1em] h-[1em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
      aria-hidden="true"
    />
  );
}

export default function ExpressiveLink({ href, children }) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 focus:outline-none"
      >
        <span>{children}</span>
        <Arrow />
      </a>
    );
  }
  return (
    <NavLink
      to={href}
      className="group inline-flex items-center gap-1  focus:outline-none"
    >
      <span>{children}</span>
      <Arrow />
    </NavLink>
  );
}
