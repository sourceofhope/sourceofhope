import { useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { Container } from "../container";
import { BackLinkRow, PageHeader, type BackLink, type PageHeaderProps, type PageImage } from "../page-header";
import { Section } from "../section";
import { Main } from "./main";

/*
 * Page templates (spec §7). Every route renders exactly one of these, which
 * gives it one `<main>`, one h1 and the shared rhythm. Routes pass content
 * into named slots; they never add their own wrappers or padding.
 */

/**
 * Landing (Home): a custom hero, then sections. The h1 lives in the hero,
 * so the Home route is responsible for it; e2e checks Home has exactly one.
 */
export function LandingTemplate({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  return (
    <Main>
      {hero}
      {children}
    </Main>
  );
}

/**
 * Content (Our Story, Careers, Contact, Partners & Sponsors, Privacy,
 * Terms): PageHeader, then Sections, then an optional closing CtaBand.
 */
export function ContentTemplate({ header, children, cta }: { header: PageHeaderProps; children: ReactNode; cta?: ReactNode }) {
  return (
    <Main>
      <PageHeader {...header} />
      {children}
      {cta}
    </Main>
  );
}

/** Fact: a short titled block (h2) inside a band, used for Program's "Who it serves" / "When and where". */
function Fact({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 border-t border-line pt-6">
      <Heading level={2} size="2xl" id={id}>
        {title}
      </Heading>
      {children}
    </section>
  );
}

export type ProgramTemplateProps = {
  /** The program's name (h1), one line about it, a photo, and the Hub actions. */
  header: { title: string; summary: ReactNode; image: PageImage; actions?: ReactNode };
  about: ReactNode;
  audience?: ReactNode;
  schedule?: ReactNode;
  events?: ReactNode;
  help?: ReactNode;
  gallery?: ReactNode;
  faq?: ReactNode;
  cta?: ReactNode;
};

/**
 * Program (the five program pages): a fixed order so every program reads
 * the same way (spec §7, ADR-0007). Editors fill the slots; empty slots
 * are left out.
 */
export function ProgramTemplate({ header, about, audience, schedule, events, help, gallery, faq, cta }: ProgramTemplateProps) {
  const t = useTranslations("Layout.program");
  return (
    <Main>
      <PageHeader title={header.title} lead={header.summary} image={header.image} actions={header.actions} size="lg" />
      <Section title={t("about")} width="prose">
        {about}
      </Section>
      {audience || schedule ? (
        // Two short facts side by side, so they don't each take a full band.
        <div className="pb-section">
          <Container>
            <div className="grid gap-10 md:grid-cols-2">
              {audience ? <Fact title={t("audience")}>{audience}</Fact> : null}
              {schedule ? <Fact title={t("schedule")}>{schedule}</Fact> : null}
            </div>
          </Container>
        </div>
      ) : null}
      {events ? (
        <Section title={t("events")} tone="muted">
          {events}
        </Section>
      ) : null}
      {help ? <Section title={t("help")}>{help}</Section> : null}
      {gallery ? <Section title={t("gallery")}>{gallery}</Section> : null}
      {faq ? (
        <Section title={t("faq")} width="prose">
          {faq}
        </Section>
      ) : null}
      {cta}
    </Main>
  );
}

/**
 * Listing (Programs, Events, News & Media, Team, Store): PageHeader, optional
 * filters, the grid or list, then pagination or "load more". Item titles are
 * h2 in a flat list, or h3 when the list is grouped under h2s (events by month).
 */
export function ListingTemplate({
  header,
  filters,
  children,
  footer,
}: {
  header: PageHeaderProps;
  filters?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Main>
      <PageHeader {...header} />
      <Section>
        {filters ? <div className="mb-8">{filters}</div> : null}
        {children}
        {footer ? <div className="mt-10 flex justify-center">{footer}</div> : null}
      </Section>
    </Main>
  );
}

export type DetailTemplateProps = {
  back: BackLink;
  /** The h1: a person's name or a product's name. */
  title: string;
  eyebrow?: string;
  /** Short facts under the title: a role, a price. */
  meta?: ReactNode;
  /** The photo, or a product's images. */
  media: ReactNode;
  /** The bio or description, then any actions. */
  children: ReactNode;
  /** "More from the team", "You might also like". */
  related?: { title: string; content: ReactNode };
};

/** Detail (team profile, product): back link, h1, media beside the body, related items. */
export function DetailTemplate({ back, title, eyebrow, meta, media, children, related }: DetailTemplateProps) {
  return (
    <Main>
      <div className="py-section-sm">
        <Container>
          <div className="mb-6">
            <BackLinkRow {...back} />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div>{media}</div>
            <div className="flex flex-col gap-4">
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              <Heading level={1}>{title}</Heading>
              {meta ? <div className="text-lg text-muted">{meta}</div> : null}
              <div className="mt-2 flex flex-col gap-6">{children}</div>
            </div>
          </div>
        </Container>
      </div>
      {related ? (
        <Section title={related.title} tone="muted">
          {related.content}
        </Section>
      ) : null}
    </Main>
  );
}

/**
 * Utility (cart, checkout, success, 404, 500): a short heading and focused
 * content in a narrow column. No PageHeader band, no decoration.
 */
export function UtilityTemplate({ title, lead, children, width = "prose" }: { title: string; lead?: ReactNode; children?: ReactNode; width?: "prose" | "page" }) {
  return (
    <Main>
      <div className="py-section">
        <Container width={width}>
          <div className="flex flex-col gap-4">
            <Heading level={1} size="3xl">
              {title}
            </Heading>
            {lead ? <div className="text-lg text-ink-soft">{lead}</div> : null}
          </div>
          {children ? <div className="mt-8 flex flex-col gap-6">{children}</div> : null}
        </Container>
      </div>
    </Main>
  );
}
