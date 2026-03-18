import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface LinkButtonProps extends ButtonProps {
  href: string;
}

interface AnchorButtonProps {
  children: ReactNode;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
}

export function Button({ children, className = "", onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 bg-accent-600 hover:bg-accent-700 text-neutral-50 font-semibold rounded transition ${className}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({ href, children, className = "" }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-6 py-3 bg-accent-600 hover:bg-accent-700 text-neutral-50 font-semibold rounded transition ${className}`}
    >
      {children}
    </Link>
  );
}

export function AnchorButton({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
}: AnchorButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`inline-flex items-center px-6 py-3 bg-accent-600 hover:bg-accent-700 text-neutral-50 font-semibold rounded transition ${className}`}
    >
      {children}
    </a>
  );
}
