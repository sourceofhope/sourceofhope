import { Eyebrow, Heading } from "@/components/ui/heading";
import { ExternalLink, TextLink } from "@/components/ui/link";

export function TextSection() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Eyebrow>Eyebrow</Eyebrow>
        <Heading level={3} size="4xl">
          Heading level 3, size 4xl
        </Heading>
        <Heading level={3}>Heading level 3, default size</Heading>
        <Heading level={4}>Heading level 4, default size</Heading>
        <p className="max-w-prose text-lg">
          Body text with a <TextLink href="/about">TextLink to Our Story</TextLink>, an{" "}
          <ExternalLink href="https://211texas.org">ExternalLink to 211 Texas</ExternalLink> and one that{" "}
          <ExternalLink href="https://www.thesourceofhope.org/v2/documents/TSOH-Volunteer-Agreement.pdf" newTab>
            opens in a new tab
          </ExternalLink>
          . Phone: <ExternalLink href="tel:+14699690244">(469) 969-0244</ExternalLink>.
        </p>
        <p>
          <TextLink href="/events" quiet>
            Quiet link (navigation lists)
          </TextLink>
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-surface-inverse p-6">
        <Eyebrow surface="inverse">The Source of Hope</Eyebrow>
        <Heading level={3} surface="inverse" size="3xl">
          On a dark surface
        </Heading>
        <p className="text-on-inverse-muted">
          Footer links: <TextLink href="/about" surface="inverse" quiet>Our story</TextLink> ·{" "}
          <ExternalLink href="https://www.instagram.com/" surface="inverse" quiet>
            Instagram
          </ExternalLink>
        </p>
      </div>
      <p className="text-sm text-muted">
        SkipLink: press Tab once on any page; it appears top-left and jumps to <code>#main</code>.
      </p>
    </div>
  );
}
