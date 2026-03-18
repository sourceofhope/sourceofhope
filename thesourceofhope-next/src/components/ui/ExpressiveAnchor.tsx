import { ReactNode } from "react";

interface ExpressiveAnchorProps {
  children: ReactNode;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
}

export default function ExpressiveAnchor({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
}: ExpressiveAnchorProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`text-accent-600 hover:text-accent-700 font-semibold transition ${className}`}
    >
      {children}
    </a>
  );
}
