"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { HubLinkButton } from "@/components/layout/hub-link";
import { HEADER_SOLID_SENTINEL_ID } from "@/components/layout/site-header";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { VideoHero } from "@/components/ui/video-hero";

/** How far down the page (as a share of the hero's height) the video finishes easing into its card. */
const SHRINK_DISTANCE = 1 / 3;

/**
 * The homepage hero (spec §10.1, §5.8): the full-bleed video with the
 * tagline on top. On scroll it eases into a card inset 40px with 12px
 * corners, driven by scroll position (rAF-throttled, passive; it never
 * blocks scrolling). The header turns solid when it finishes, via the
 * sentinel. Reduced motion: no shrink (and VideoHero shows the poster).
 */
export function HomeHero() {
  const t = useTranslations("Home.hero");
  const actions = useTranslations("Shell.actions");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight * SHRINK_DISTANCE)));
      el.style.setProperty("--hero-inset", `${(progress * 2.5).toFixed(3)}rem`);
      el.style.setProperty("--hero-radius", `${(progress * 12).toFixed(2)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="relative px-(--hero-inset)">
      <VideoHero
        className="rounded-(--hero-radius)"
        poster="/v2/core/TSOH-Poster.webp"
        sources={[
          { src: "/v2/core/TSOH-Hero-1080.webm", type: "video/webm", media: "(min-width: 1024px)" },
          { src: "/v2/core/TSOH-Hero-720.webm", type: "video/webm" },
          { src: "/v2/core/TSOH-Hero-720.mp4", type: "video/mp4" },
        ]}
      >
        <div className="mx-auto flex min-h-(--hero-min-height) max-w-page flex-col justify-end gap-4 px-4 pt-section-lg pb-section md:px-8 lg:px-10">
          <Eyebrow surface="inverse">{t("eyebrow")}</Eyebrow>
          <Heading level={1} size="5xl" surface="inverse" className="max-w-4xl">
            {t("title")}
          </Heading>
          <p className="hidden max-w-prose text-lg text-on-inverse-muted md:block">{t("intro")}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <HubLinkButton hub={{ action: "give" }} surface="inverse" size="lg">
              {actions("give")}
            </HubLinkButton>
            <HubLinkButton hub={{ action: "volunteer" }} variant="secondary" surface="inverse" size="lg">
              {actions("volunteer")}
            </HubLinkButton>
            <HubLinkButton hub={{ action: "help" }} variant="tertiary" surface="inverse" size="lg" withIcon>
              {actions("help")}
            </HubLinkButton>
          </div>
        </div>
      </VideoHero>
      <div id={HEADER_SOLID_SENTINEL_ID} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3" />
    </div>
  );
}
