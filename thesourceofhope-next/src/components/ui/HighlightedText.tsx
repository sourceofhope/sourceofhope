"use client";

import { useEffect, useMemo, useRef, useState, ReactNode } from "react";

const DefaultGenerator = {
  LINEAR: (t: number) => t,
  EASE_IN: (t: number) => t * t,
  EASE_OUT: (t: number) => t * (2 - t),
  EASE_IN_OUT: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

interface HighlightedTextProps {
  children: ReactNode;
  className?: string;
  start?: number;
  end?: number;
  duration?: number;
  threshold?: number;
  generator?: (t: number) => number;
  ariaLive?: "polite" | "assertive" | "off";
}

export default function HighlightedText({
  children,
  className = "",
  start = 0,
  end = 1,
  duration = 500,
  threshold = 0.1,
  generator = DefaultGenerator.LINEAR,
  ariaLive = "polite",
}: HighlightedTextProps) {
  const reference = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [value, setValue] = useState(start);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: threshold }
    );

    if (reference.current) observer.observe(reference.current);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const normalProgress = Math.min((currentTime - startTime) / duration, 1);
      const generatedProgress = generator(normalProgress);

      const currentValue = start + (end - start) * generatedProgress;

      setValue(currentValue);

      if (normalProgress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, start, end, duration, generator]);

  return (
    <span
      ref={reference}
      aria-live={ariaLive}
      style={{ "--hl-w": `${value * 100}%` } as React.CSSProperties}
      className={`relative inline-block align-baseline isolate z-0
        after:content-[''] after:absolute after:left-0 after:top-1/4
        after:block after:h-1/2 after:[width:var(--hl-w)]
        after:bg-yellow-300 after:-z-10 after:pointer-events-none
        ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
}
