import { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  className?: string;
}

export default function Heading({ children, className = "" }: HeadingProps) {
  return (
    <h3
      className={`text-sm md:text-md font-montserrat text-accent-700 font-bold uppercase scale-y-85 ${className}`}>
      {children}
    </h3>
  );
}
