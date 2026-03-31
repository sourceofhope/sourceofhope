"use client";

import { useEffect, useRef, useState } from "react";

export const DefaultGenerator = {
  LINEAR: (interval: number) => interval,
  EASE_IN: (interval: number) => Math.pow(interval, Math.E),
  EASE_OUT: (interval: number) => 1 - Math.pow(1 - interval, Math.E),
  EASE_IN_OUT: (interval: number) =>
    interval < 0.5
      ? 0.5 * Math.pow(2 * interval, Math.E)
      : 1 - 0.5 * Math.pow(2 * (1 - interval), Math.E),
};

type Generator = (interval: number) => number;

interface ExpressiveNumberProps {
  end: number;
  start?: number;
  duration?: number;
  threshold?: number;
  generator?: Generator;
  ariaLive?: "off" | "polite" | "assertive";
  caption: string;
  pre?: string;
  post?: string;
}

export function ExpressiveNumber({
  end,
  start = 0,
  duration = 5000,
  threshold = 0.1,
  generator = DefaultGenerator.LINEAR,
  ariaLive = "polite",
  caption,
  pre = "",
  post = "",
}: ExpressiveNumberProps) {
  const reference = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const [inView, setInView] = useState(false);
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (hasAnimated.current || !reference.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(reference.current);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!inView) return;

    hasAnimated.current = true;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;

      const normalProgress = Math.min((currentTime - startTime) / duration, 1);
      const generatedProgress = generator(normalProgress);
      const currentValue = Math.round(
        start + (end - start) * generatedProgress
      );

      setValue(currentValue);

      if (normalProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, end, generator, inView, start]);

  return (
    <div className="text-center" ref={reference}>
      <div
        className="text-3xl md:text-4xl font-bold text-neutral-50 font-urbanist"
        aria-live={ariaLive}
      >
        {pre}
        <span>{value.toLocaleString()}</span>
        {post}
      </div>
      <p className="text-sm md:text-base text-neutral-300 mt-2">{caption}</p>
    </div>
  );
}
