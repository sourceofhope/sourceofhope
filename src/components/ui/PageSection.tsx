import { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Shares the site header's horizontal gutter so page content lines up with the logo.
export default function PageSection({
  children,
  className = "",
  id,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={`w-full grid gap-10 py-5 px-5 lg:px-35 scroll-mt-25 ${className}`}>
      {children}
    </section>
  );
}
