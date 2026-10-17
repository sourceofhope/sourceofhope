import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

export default function Title({
  children,
  className = "",
  as: Tag = "h2",
}: TitleProps) {
  return (
    <Tag
      className={`font-urbanist font-semibold text-xlg md:text-xxlg ${className}`}>
      {children}
    </Tag>
  );
}
