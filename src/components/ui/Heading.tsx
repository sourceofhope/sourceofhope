import { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h3";
}

export default function Heading({
  children,
  className = "",
  as: Tag = "h3",
}: HeadingProps) {
  return (
    <Tag
      className={`text-sm md:text-md font-montserrat text-accent-700 font-bold uppercase scale-y-85 ${className}`}>
      {children}
    </Tag>
  );
}
