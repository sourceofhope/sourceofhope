import Link from "next/link";
import { ReactNode } from "react";

interface SimpleLinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

export default function SimpleLink({
  to,
  className = "",
  children,
}: SimpleLinkProps) {
  return (
    <Link
      href={to}
      className={`${className} hover:underline font-semibold text-accent-900`}
    >
      {children}
    </Link>
  );
}
