import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

export default function ExpressiveAnchor({ href, children}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex w-full justify-between items-center gap-1 focus:outline-none"
    >
      <span>{children}</span>
      <ArrowUpRightIcon
        className="w-[1em] h-[1em] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
        aria-hidden="true"
      />
    </a>
  );
}
