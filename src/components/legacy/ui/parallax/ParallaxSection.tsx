"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ParallaxContext } from "./ParallaxLayer";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
}

export default function ParallaxSection({
  children,
  className = "",
}: ParallaxSectionProps) {
  const sectionReference = useRef<HTMLElement>(null);

  // Deterministic initial values for both server and first client render
  const [progress, setProgress] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const updateProgress = useCallback(() => {
    const section = sectionReference.current;
    if (!section || typeof window === "undefined") {
      return;
    }

    const elementBounds = section.getBoundingClientRect();
    const nextViewportHeight = window.innerHeight || 0;
    const viewportDistance = elementBounds.height + nextViewportHeight;
    const elementInside = nextViewportHeight - elementBounds.top;

    const elementProgress = Math.min(
      1,
      Math.max(0, viewportDistance > 0 ? elementInside / viewportDistance : 0),
    );

    setProgress(elementProgress);
    setSectionHeight(elementBounds.height);
    setViewportHeight(nextViewportHeight);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateProgress();

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    const onResize = () => {
      updateProgress();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateProgress]);

  const context = useMemo(
    () => ({
      progress,
      sectionHeight,
      viewportHeight,
    }),
    [progress, sectionHeight, viewportHeight],
  );

  return (
    <section ref={sectionReference} className={`relative top-0 ${className}`}>
      <ParallaxContext.Provider value={context}>
        <div className="relative h-full w-full">{children}</div>
      </ParallaxContext.Provider>
    </section>
  );
}
