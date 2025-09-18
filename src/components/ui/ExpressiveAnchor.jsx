export default function ExpressiveAnchor({ href, children}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex w-full justify-between items-center gap-1 focus:outline-none"
    >
      <span>{children}</span>
      <ArrowRightIcon
        className="w-[1em] h-[1em] transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </a>
  );
}
