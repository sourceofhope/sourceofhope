import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubLinkButton } from "@/components/layout/hub-link";
import { Section } from "@/components/layout/section";
import { SiteShell } from "@/components/layout/site-shell";
import { HEADER_SOLID_SENTINEL_ID } from "@/components/layout/site-header";
import { LandingTemplate } from "@/components/layout/templates";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { VideoHero } from "@/components/ui/video-hero";
import { isStyleguideEnabled } from "../enabled";

/*
 * /styleguide/shell: the full site shell with the homepage's overlay header
 * (spec §8.2). The header is transparent over the hero and turns solid once
 * the sentinel at the hero's end passes under it. Every other page uses the
 * solid header; see any 404 for that.
 */
export const metadata: Metadata = { title: "Shell · Styleguide", robots: { index: false, follow: false } };

export default function ShellDemoPage() {
  if (!isStyleguideEnabled()) notFound();
  return (
    <SiteShell overlay>
      <LandingTemplate
        hero={
          <VideoHero
            poster="/v2/core/TSOH-Poster.webp"
            sources={[
              { src: "/v2/core/TSOH-Hero-720.webm", type: "video/webm" },
              { src: "/v2/core/TSOH-Hero-720.mp4", type: "video/mp4" },
            ]}
          >
            <div className="mx-auto flex min-h-(--hero-min-height) max-w-page flex-col justify-end gap-4 px-4 pt-section-lg pb-section-lg md:px-8 lg:px-10">
              <Eyebrow surface="inverse">The Source of Hope</Eyebrow>
              <Heading level={1} size="5xl" surface="inverse">
                Empowering and providing hope through education, health, and wellness
              </Heading>
              <div className="flex flex-wrap gap-3 pt-2">
                <HubLinkButton hub={{ action: "give" }} surface="inverse">
                  Give
                </HubLinkButton>
                <HubLinkButton hub={{ action: "volunteer" }} variant="secondary" surface="inverse">
                  Volunteer
                </HubLinkButton>
                <HubLinkButton hub={{ action: "help" }} variant="tertiary" surface="inverse" withIcon>
                  Get Help
                </HubLinkButton>
              </div>
            </div>
            <div id={HEADER_SOLID_SENTINEL_ID} aria-hidden="true" />
          </VideoHero>
        }
      >
        {["Our impact", "Upcoming events", "Our programs"].map((title, i) => (
          <Section key={title} title={title} tone={i % 2 ? "muted" : "default"}>
            <p className="max-w-prose text-lg text-ink-soft">
              Scroll back up: the header goes transparent again once the hero is back under it.
            </p>
            <div className="h-64" />
          </Section>
        ))}
      </LandingTemplate>
    </SiteShell>
  );
}
