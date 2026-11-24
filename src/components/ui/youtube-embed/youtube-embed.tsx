"use client";

import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { focusRing, tv } from "../lib/tv";

const youTubeStyles = tv({
  slots: {
    root: "relative aspect-video overflow-hidden rounded-lg bg-surface-inverse",
    facade: ["group absolute inset-0 grid size-full cursor-pointer place-items-center", focusRing.default],
    thumb: "object-cover",
    play: [
      "relative grid size-16 place-items-center rounded-full bg-surface-inverse/80 text-on-inverse shadow-overlay",
      "transition-transform duration-(--duration-fast) group-hover:scale-110 motion-reduce:transition-none [&_svg]:size-8",
    ],
    frame: "absolute inset-0 size-full border-0",
  },
});

export type YouTubeEmbedProps = {
  /** The video id, the part after `v=` in a YouTube link. */
  id: string;
  /** The video's title, used for the play button and the frame. */
  title: string;
};

/**
 * YouTubeEmbed: a thumbnail and a play button until pressed, then the real
 * player from youtube-nocookie.com. No YouTube code or cookies load until the
 * visitor asks for the video, which keeps pages fast and private.
 */
export function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  const t = useTranslations("UI");
  const s = youTubeStyles();
  const [loaded, setLoaded] = useState(false);
  const videoId = encodeURIComponent(id);

  return (
    <div className={s.root()}>
      {loaded ? (
        <iframe
          className={s.frame()}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className={s.facade()} onClick={() => setLoaded(true)} aria-label={t("playVideoTitled", { title })}>
          <NextImage src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" fill sizes="(min-width: 48rem) 48rem, 100vw" className={s.thumb()} />
          <span className={s.play()} aria-hidden="true">
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
}
