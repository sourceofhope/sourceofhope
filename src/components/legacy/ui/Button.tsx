import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  text: string;
}

interface LinkButtonProps {
  text: string;
  href: string;
  className?: string;
  full?: boolean;
}

interface AnchorButtonProps {
  text: string;
  href: string;
  className?: string;
  full?: boolean;
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

export function LinkButton({ text, href, className = "", full = false }: LinkButtonProps) {
  return (
    <Link
      href={href}
      aria-label={text}
      className={`
        ${className}
        !no-underline group inline-flex items-center
        rounded-2xl px-10 py-5
        bg-accent-500 hover:bg-accent-600
        transition-all duration-700 font-semibold text-neutral-50
        ${full ? "w-full" : "w-auto"}
      `}
    >
      <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
        <span>{text}</span>
        <ArrowRightIcon className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function AnchorButton({
  text,
  href,
  className = "",
  full = false,
}: AnchorButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={text}
      className={`
        ${className}
        !no-underline group inline-flex items-center
        rounded-2xl px-10 py-5
        bg-accent-500 hover:bg-accent-600
        transition-all duration-700 font-semibold text-neutral-50
        ${full ? "w-full" : "w-auto"}
      `}
    >
      <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
        <span>{text}</span>
        <ArrowUpRightIcon className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
    </a>
  );
}
