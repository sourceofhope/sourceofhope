import { useId, type ReactNode } from "react";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { Container } from "../container";

export type SectionHeadingProps = {
  /** The h2. Plain words ("Upcoming events"), no taglines (spec §10.1). */
  title: string;
  /** Optional small line above the title. */
  eyebrow?: string;
  /** Optional one or two sentences under the title. */
  lead?: ReactNode;
  /** Optional link beside the title on wide screens, e.g. "See all events". */
  action?: ReactNode;
  surface?: "default" | "inverse";
  id?: string;
};

/** SectionHeading: eyebrow, h2 and lead for a page section (spec §7). */
export function SectionHeading({ title, eyebrow, lead, action, surface = "default", id }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-prose flex-col gap-2">
        {eyebrow ? <Eyebrow surface={surface}>{eyebrow}</Eyebrow> : null}
        <Heading level={2} id={id} surface={surface}>
          {title}
        </Heading>
        {lead ? <div className={surface === "inverse" ? "text-lg text-on-inverse-muted" : "text-lg text-muted"}>{lead}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

const SPACING = { sm: "py-section-sm", md: "py-section", lg: "py-section-lg" } as const;
const TONE = {
  default: "bg-surface text-ink",
  muted: "bg-surface-muted text-ink",
  inverse: "bg-surface-inverse text-on-inverse",
} as const;

export type SectionProps = Omit<SectionHeadingProps, "surface" | "id" | "title"> & {
  /** The section's h2. A titled section becomes a labelled `<section>` landmark. */
  title?: string;
  /** Vertical rhythm. Sections never set their own padding (spec §5.3). */
  spacing?: keyof typeof SPACING;
  /** Background band. `inverse` is the navy band; children should use `surface="inverse"`. */
  tone?: keyof typeof TONE;
  /** Narrow the content to a reading measure. */
  width?: "page" | "prose";
  /** Anchor for in-page links. */
  id?: string;
  children: ReactNode;
};

/**
 * Section: one band of a page, with the shared spacing, background and
 * heading. Pages are a stack of these; nothing else adds vertical padding.
 */
export function Section({ title, eyebrow, lead, action, spacing = "md", tone = "default", width, id, children }: SectionProps) {
  const headingId = useId();
  const Tag = title ? "section" : "div";
  return (
    <Tag id={id} aria-labelledby={title ? headingId : undefined} className={`${SPACING[spacing]} ${TONE[tone]} scroll-mt-24`}>
      <Container width={width}>
        {title ? (
          <SectionHeading id={headingId} title={title} eyebrow={eyebrow} lead={lead} action={action} surface={tone === "inverse" ? "inverse" : "default"} />
        ) : null}
        {children}
      </Container>
    </Tag>
  );
}
