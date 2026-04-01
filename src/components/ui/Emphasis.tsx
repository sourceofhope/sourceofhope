import { ReactNode } from "react";

interface EmphasisProps {
  children: ReactNode;
  className?: string;
}

export default function Emphasis({ children, className = "" }: EmphasisProps) {
  return (
    <span className={`font-semibold text-accent-600 ${className}`}>
      {children}
    </span>
  );
}
