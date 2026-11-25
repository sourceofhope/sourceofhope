import type { ReactNode } from "react";
import { CtaBand } from "@/components/layout/cta-band";
import { Prose } from "@/components/layout/prose";
import { Section } from "@/components/layout/section";
import { ContentTemplate, DetailTemplate, LandingTemplate, ListingTemplate, ProgramTemplate, UtilityTemplate } from "@/components/layout/templates";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardLink } from "@/components/ui/card";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { TextLink } from "@/components/ui/link";
import { Stat, StatList } from "@/components/ui/stat";
import { VideoHero } from "@/components/ui/video-hero";

/*
 * Sample pages for each template (spec §7). The copy is illustrative, not
 * final content. Links point back into the styleguide.
 */

const HOME = "/styleguide#templates";
const PHOTO = { width: 800, height: 600 };

const EVENTS = [
  { title: "Serving Hope meal service", date: "Sat, Dec 12 · 11:00 a.m.", img: "/v2/servingHope/Carousel-5.webp", alt: "Volunteers serving hot meals", badges: ["public", "volunteer"] as const },
  { title: "Holiday toy drive", date: "Sat, Dec 19 · 10:00 a.m.", img: "/v2/servingHope/Carousel-2.webp", alt: "Guests at a holiday event", badges: ["public"] as const },
  { title: "Food packing night", date: "Thu, Jan 7 · 6:00 p.m.", img: "/v2/servingHope/Carousel-3.webp", alt: "Volunteers packing food", badges: ["volunteer"] as const },
];

const BADGE_TEXT = { public: "Open to the public", volunteer: "Volunteers needed" } as const;

function EventCards({ level = 3 }: { level?: 2 | 3 }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {EVENTS.map((e) => (
        <Card key={e.title} as="li" interactive>
          <Image src={e.img} alt={e.alt} {...PHOTO} className="aspect-video w-full object-cover" />
          <div className="flex flex-col gap-2 p-5">
            <div className="flex flex-wrap gap-1.5">
              {e.badges.map((b) => (
                <Badge key={b} tone={b}>
                  {BADGE_TEXT[b]}
                </Badge>
              ))}
            </div>
            <Heading level={level} size="xl">
              <CardLink href={HOME}>{e.title}</CardLink>
            </Heading>
            <p className="text-muted">{e.date}</p>
          </div>
        </Card>
      ))}
    </ul>
  );
}

function HubActions({ surface = "default" }: { surface?: "default" | "inverse" }) {
  return (
    <>
      <LinkButton href={HOME} surface={surface}>
        Give
      </LinkButton>
      <LinkButton href={HOME} variant="secondary" surface={surface}>
        Volunteer
      </LinkButton>
    </>
  );
}

const closing = <CtaBand title="Help us serve more families" text="Volunteer at an event, or give once or monthly." actions={<HubActions surface="inverse" />} />;

function LandingDemo() {
  return (
    <LandingTemplate
      hero={
        <VideoHero
          poster="/v2/core/TSOH-Poster.webp"
          sources={[
            { src: "/v2/core/TSOH-Hero-720.webm", type: "video/webm" },
            { src: "/v2/core/TSOH-Hero-720.mp4", type: "video/mp4" },
          ]}
        >
          <div className="mx-auto flex min-h-128 max-w-page flex-col justify-end gap-4 px-4 pt-section pb-section-lg md:px-8 lg:px-10">
            <Eyebrow surface="inverse">The Source of Hope</Eyebrow>
            <Heading level={1} size="5xl" surface="inverse">
              Empowering and providing hope through education, health, and wellness
            </Heading>
            <div className="flex flex-wrap gap-3 pt-2">
              <HubActions surface="inverse" />
              <LinkButton href={HOME} variant="tertiary" surface="inverse">
                Get Help
              </LinkButton>
            </div>
          </div>
        </VideoHero>
      }
    >
      <Section title="Our impact" lead="Sample figures, not real ones. Real values come from Sanity with an as-of year." spacing="sm">
        <StatList>
          <Stat value="120,000+" label="Meals served" />
          <Stat value="3,400" label="Volunteers" />
          <Stat value="5" label="Programs" />
        </StatList>
      </Section>
      <Section title="Upcoming events" tone="muted" action={<TextLink href={HOME}>See all events</TextLink>}>
        <EventCards />
      </Section>
      {closing}
    </LandingTemplate>
  );
}

function ContentDemo() {
  return (
    <ContentTemplate
      header={{
        eyebrow: "About",
        title: "Our Story",
        lead: "A sample Content page: PageHeader with an image, then sections of prose, then the closing band.",
        image: { src: "/v2/core/TSOH-Group.webp", alt: "The Source of Hope team at an event", ...PHOTO },
      }}
      cta={closing}
    >
      <Section title="Our mission" width="prose">
        <Prose>
          <p>
            Sample prose. Long-form text sits in a reading column with even spacing between paragraphs, lists and
            subheadings, so every Content page reads the same way.
          </p>
          <ul>
            <li>Education</li>
            <li>Health</li>
            <li>Wellness</li>
          </ul>
          <h3>How we work</h3>
          <p>
            Subheadings inside prose are h3, under the section&apos;s h2. Links look like{" "}
            <TextLink href={HOME}>this one</TextLink>.
          </p>
        </Prose>
      </Section>
      <Section title="Where we serve" tone="muted" width="prose">
        <Prose>
          <p>A muted band separates sections without borders or decoration.</p>
        </Prose>
      </Section>
    </ContentTemplate>
  );
}

function ProgramDemo() {
  return (
    <ProgramTemplate
      header={{
        title: "Serving Hope",
        summary: "Sample program page: hot meals and groceries at monthly community events.",
        image: { src: "/v2/servingHope/Carousel-1.webp", alt: "Volunteers serving meals", ...PHOTO },
        actions: <HubActions />,
      }}
      about={
        <Prose>
          <p>What the program is, in two or three plain sentences from Sanity.</p>
        </Prose>
      }
      audience={
        <Prose>
          <p>Anyone who needs a meal. No sign-up or ID needed.</p>
        </Prose>
      }
      schedule={
        <Prose>
          <p>The second Saturday of every month, 11:00 a.m. to 1:00 p.m.</p>
        </Prose>
      }
      events={<EventCards />}
      help={
        <div className="flex flex-wrap gap-3">
          <HubActions />
        </div>
      }
      gallery={
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[4, 6, 7, 8].map((n) => (
            <li key={n}>
              <Image src={`/v2/servingHope/Carousel-${n}.webp`} alt={`Serving Hope event photo ${n}`} {...PHOTO} radius="md" className="aspect-square w-full object-cover" />
            </li>
          ))}
        </ul>
      }
      faq={
        <Accordion>
          <AccordionItem value="signup" title="Do I need to sign up?" level={3}>
            No. Come to any event.
          </AccordionItem>
          <AccordionItem value="bring" title="What should I bring?" level={3}>
            Nothing. Bags are provided.
          </AccordionItem>
        </Accordion>
      }
      cta={closing}
    />
  );
}

function ListingDemo() {
  return (
    <ListingTemplate
      header={{ title: "Events", lead: "A sample Listing page: header, filters, a grid, then load more." }}
      filters={
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events">
          <Button type="button" size="sm" aria-pressed="true">
            All
          </Button>
          <Button type="button" size="sm" variant="secondary" aria-pressed="false">
            Volunteer
          </Button>
          <Button type="button" size="sm" variant="secondary" aria-pressed="false">
            Open to the public
          </Button>
        </div>
      }
      footer={
        <Button type="button" variant="secondary">
          Load more events
        </Button>
      }
    >
      <EventCards level={2} />
    </ListingTemplate>
  );
}

function DetailDemo() {
  return (
    <DetailTemplate
      back={{ href: HOME, label: "All team members" }}
      eyebrow="Leadership"
      title="Team member name"
      meta="Title, per the glossary"
      media={<Image src="/v2/core/TSOH-Founder.webp" alt="Portrait of the team member" {...PHOTO} radius="lg" className="aspect-4/5 w-full object-cover" />}
      related={{ title: "More from the team", content: <EventCards /> }}
    >
      <Prose>
        <p>A sample Detail page. The bio comes from Sanity and uses the same prose styles as Content pages.</p>
        <p>The back link, h1 and photo keep the same positions on every profile and product.</p>
      </Prose>
    </DetailTemplate>
  );
}

function UtilityDemo() {
  return (
    <UtilityTemplate title="Page not found" lead="We couldn't find that page. It may have moved.">
      <div className="flex flex-wrap gap-3">
        <LinkButton href={HOME}>Go to the homepage</LinkButton>
        <LinkButton href={HOME} variant="secondary">
          See upcoming events
        </LinkButton>
      </div>
    </UtilityTemplate>
  );
}

export const TEMPLATE_DEMOS: Record<string, { name: string; usedBy: string; Demo: () => ReactNode }> = {
  landing: { name: "Landing", usedBy: "Home", Demo: LandingDemo },
  content: { name: "Content", usedBy: "Our Story, Careers, Contact, Partners & Sponsors, Privacy, Terms", Demo: ContentDemo },
  program: { name: "Program", usedBy: "The five program pages", Demo: ProgramDemo },
  listing: { name: "Listing", usedBy: "Programs, Events, News & Media, Team, Store", Demo: ListingDemo },
  detail: { name: "Detail", usedBy: "Team profile, product", Demo: DetailDemo },
  utility: { name: "Utility", usedBy: "Cart, checkout, success, 404, 500", Demo: UtilityDemo },
};
