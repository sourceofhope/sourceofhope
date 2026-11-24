"use client";

import { Children, useState, type CSSProperties, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import { buttonStyles } from "../button/button.styles";
import { tv } from "../lib/tv";

const marqueeStyles = tv({
  slots: {
    root: "group/marquee relative flex items-center gap-2",
    window: [
      "flex-1 overflow-hidden",
      "mask-x-from-90% mask-x-to-100%",
      // Reduced motion: no animation; the row scrolls by hand instead.
      "motion-reduce:overflow-x-auto motion-reduce:mask-none",
    ],
    track: [
      "flex w-max animate-marquee",
      "group-hover/marquee:animation-paused group-focus-within/marquee:animation-paused",
      "motion-reduce:animate-none",
    ],
    list: "m-0 flex list-none items-center gap-12 p-0 pr-12",
    copy: "motion-reduce:hidden",
    item: "flex shrink-0 items-center",
    toggle: "shrink-0 motion-reduce:hidden",
  },
  variants: {
    paused: { true: { track: "animation-paused" } },
  },
});

export type MarqueeProps = {
  /** Names the strip, e.g. "Our sponsors". */
  label: string;
  /** Seconds per item for one pass; the strip's speed stays constant whatever the count. */
  secondsPerItem?: number;
  /** One child per item (a sponsor logo). */
  children: ReactNode;
};

/**
 * Marquee: a row of logos that drifts at a constant speed (the sponsor strip,
 * spec §9.1). It stops on hover and focus, has a pause button (WCAG 2.2.2),
 * and stands still and scrolls by hand for reduced motion. The list is drawn
 * twice for a seamless loop; the copy is hidden from screen readers and keys.
 */
export function Marquee({ label, secondsPerItem = 4, children }: MarqueeProps) {
  const t = useTranslations("UI");
  const [paused, setPaused] = useState(false);
  const s = marqueeStyles({ paused });
  const items = Children.toArray(children);
  const style = { "--marquee-duration": `${Math.max(items.length, 1) * secondsPerItem}s` } as CSSProperties;

  const list = (copy: boolean) => (
    <ul className={s.list({ class: copy ? s.copy() : undefined })} aria-hidden={copy || undefined} inert={copy || undefined}>
      {items.map((item, index) => (
        // Logos are static children; their order is their identity.
        <li key={index} className={s.item()}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className={s.root()}>
      <div className={s.window()}>
        <div className={s.track()} style={style}>
          {list(false)}
          {list(true)}
        </div>
      </div>
      <button
        type="button"
        className={buttonStyles({ variant: "tertiary", size: "sm", iconOnly: true, class: s.toggle() })}
        aria-label={paused ? t("playAnimation") : t("pauseAnimation")}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}
      </button>
    </section>
  );
}
