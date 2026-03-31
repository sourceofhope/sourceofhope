import { ReactNode } from "react";

interface BlockquoteProps {
  children: ReactNode;
  className?: string;
}

export default function Blockquote({
  children,
  className = "",
}: BlockquoteProps) {
  return (
    <blockquote
      className={`border-l-4 border-accent-600 pl-5 text-neutral-700 ${className}`}>
      {children}
    </blockquote>
  );
}
