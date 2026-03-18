import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <h2
      className={`font-urbanist font-bold text-neutral-900 ${className}`}
    >
      {children}
    </h2>
  );
}
