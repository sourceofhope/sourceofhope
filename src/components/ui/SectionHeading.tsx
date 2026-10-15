import { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Title from "@/components/ui/Title";

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: ReactNode;
  /** Optional supporting sentence beneath the title. */
  children?: ReactNode;
  /** Use on dark (primary/accent) backgrounds. */
  inverted?: boolean;
  className?: string;
}

/**
 * Standard eyebrow + title block used at the top of page sections, so that
 * section headings read the same on every page.
 */
export default function SectionHeading({
  eyebrow,
  title,
  children,
  inverted = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`grid gap-1 justify-self-start ${className}`}>
      {eyebrow && (
        <Heading className={inverted ? "text-accent-300!" : ""}>
          {eyebrow}
        </Heading>
      )}
      <Title className={`text-balance ${inverted ? "text-neutral-50" : ""}`}>
        {title}
      </Title>
      {children && (
        <p
          className={`max-w-[65ch] mt-2 ${
            inverted ? "text-neutral-300" : "text-neutral-600"
          }`}>
          {children}
        </p>
      )}
    </div>
  );
}
