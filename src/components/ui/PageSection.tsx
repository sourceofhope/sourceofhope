import { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export default function PageSection({
  children,
  className = "",
}: PageSectionProps) {
  return (
    <section
      className={`w-full grid gap-10 py-5 px-5 md:px-15 lg:px-35 ${className}`}>
      {children}
    </section>
  );
}
