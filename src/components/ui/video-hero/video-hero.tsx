"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import { buttonStyles } from "../button/button.styles";
import { tv } from "../lib/tv";
import { useMotionAllowed } from "./use-motion-allowed";

const videoHeroStyles = tv({
  slots: {
    root: "relative isolate overflow-hidden bg-surface-inverse text-on-inverse",
    media: "absolute inset-0 -z-10 size-full object-cover",
    tint: "absolute inset-0 -z-10 bg-hero-tint",
    content: "relative",
    toggle: "absolute right-4 bottom-4",
  },
});

export type VideoHeroProps = {
  /** The background video, best format first (WebM, then an MP4 fallback). Muted, looping, decorative. */
  sources: readonly { src: string; type: "video/webm" | "video/mp4"; media?: string }[];
  /** The still shown first, and instead of the video when motion is off. */
  poster: string;
  /** The hero's heading, tagline and buttons, drawn over the video. */
  children: ReactNode;
  className?: string;
};

/**
 * VideoHero: the homepage's full-bleed background video with text on top
 * (spec §9.1). The video is decorative, so it's hidden from screen readers.
 * It plays only when motion is allowed (no reduced-motion, no Data Saver, no
 * 2G) and always has a pause button (WCAG 2.2.2).
 */
export function VideoHero({ sources, poster, children, className }: VideoHeroProps) {
  const t = useTranslations("UI");
  const s = videoHeroStyles();
  const ref = useRef<HTMLVideoElement>(null);
  const allowed = useMotionAllowed();
  const [paused, setPaused] = useState(false);
  const playing = allowed && !paused;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) {
      // Autoplay can still be refused (battery saver); the poster stays then.
      video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }
  }, [playing]);

  return (
    <div className={s.root({ class: className })}>
      <video
        ref={ref}
        className={s.media()}
        poster={poster}
        muted
        loop
        playsInline
        preload={allowed ? "auto" : "none"}
        aria-hidden="true"
        tabIndex={-1}
      >
        {allowed ? sources.map((source) => <source key={source.src} src={source.src} type={source.type} media={source.media} />) : null}
      </video>
      <div className={s.tint()} aria-hidden="true" />
      <div className={s.content()}>{children}</div>
      {allowed ? (
        <button
          type="button"
          className={buttonStyles({ variant: "secondary", surface: "inverse", iconOnly: true, class: s.toggle() })}
          aria-label={paused ? t("playVideo") : t("pauseVideo")}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}
        </button>
      ) : null}
    </div>
  );
}
