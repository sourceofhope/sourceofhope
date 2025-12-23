import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

export default function ExpressiveAnchor({
  ariaLabel,
  children,
  className,
  href,
}) {
  return (
    <a
      aria-label={ariaLabel}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`!no-underline text-sm md:text-md group inline-flex w-full justify-between items-center gap-1 focus:outline-none ${className}`}>
      <span>{children}</span>
      <ArrowUpRightIcon
        className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
        aria-hidden="true"
      />
    </a>
  );
}
