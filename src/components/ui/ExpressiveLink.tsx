import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

interface ExpressiveLinkProps {
  children: ReactNode;
  to: string;
  className?: string;
  ariaLabel?: string;
  inline?: boolean;
}

export default function ExpressiveLink({
  to,
  children,
  className = "",
  ariaLabel,
  inline = true,
}: ExpressiveLinkProps) {
  return (
    <Link
      href={to}
      aria-label={ariaLabel}
      className={`group inline-flex items-center gap-2 hover:text-accent-700 font-semibold transition ${className}`}>
      {children}
      {inline && (
        <ArrowRightIcon className="w-4 h-4 transition group-hover:translate-x-1" />
      )}
    </Link>
  );
}
