import { CtaBand } from "@/components/layout/cta-band";
import { SectionHeading } from "@/components/layout/section";
import { LinkButton } from "@/components/ui/button";
import { Card, CardLink } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { TEMPLATE_DEMOS } from "../templates/demos";

export function TemplatesSection() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Templates
        </Heading>
        <p className="max-w-prose text-muted">
          Every page uses exactly one template. Each owns the page&apos;s one <code>main</code> and one h1. Open a sample
          page:
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(TEMPLATE_DEMOS).map(([id, t]) => (
            <Card key={id} as="li" interactive>
              <div className="flex flex-col gap-1 p-5">
                <Heading level={4} size="xl">
                  <CardLink href={`/styleguide/templates/${id}`}>{t.name}</CardLink>
                </Heading>
                <p className="text-muted">{t.usedBy}</p>
              </div>
            </Card>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Site shell
        </Heading>
        <p className="max-w-prose text-muted">
          Header, phone menu and footer around a page. The homepage header starts transparent over the hero; every other
          page uses the solid one.
        </p>
        <ul className="flex flex-wrap gap-6">
          <li>
            <TextLink href="/styleguide/shell">Shell with the homepage overlay header</TextLink>
          </li>
          <li>
            <TextLink href="/this-page-does-not-exist">Shell with the solid header (a real 404)</TextLink>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          SectionHeading
        </Heading>
        <p className="max-w-prose text-muted">Shown here at h2 inside the styleguide; on pages, Section renders it for you.</p>
        <div className="rounded-lg border border-line p-6">
          <SectionHeading
            eyebrow="Get involved"
            title="Upcoming events"
            lead="An optional lead of one or two sentences."
            action={<TextLink href="/styleguide/templates/listing">See all events</TextLink>}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          CtaBand
        </Heading>
        <div className="overflow-hidden rounded-lg">
          <CtaBand
            title="Help us serve more families"
            text="Volunteer at an event, or give once or monthly."
            actions={
              <>
                <LinkButton href="/styleguide#templates" surface="inverse">
                  Give
                </LinkButton>
                <LinkButton href="/styleguide#templates" variant="secondary" surface="inverse">
                  Volunteer
                </LinkButton>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
