"use client";

import { useEffect, useRef } from "react";
import { Generator, EASE_IN_OUT } from "./DefaultGenerator";

interface ExpressiveNumberProps {
  end: number;
  caption: string;
  generator?: Generator;
  pre?: string;
  post?: string;
  elapsed?: number;
}

export function ExpressiveNumber({
  end,
  caption,
  generator = EASE_IN_OUT,
  pre = "",
  post = "",
  elapsed = 5000,
}: ExpressiveNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !spanRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        animateNumber(spanRef.current!, end, elapsed, generator);
      }
    });

    observer.observe(spanRef.current);
    return () => observer.disconnect();
  }, [end, generator, elapsed]);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-neutral-50 font-urbanist">
        {pre}
        <span ref={spanRef}>0</span>
        {post}
      </div>
      <p className="text-sm md:text-md text-neutral-300 mt-2">{caption}</p>
    </div>
  );
}

function animateNumber(
  element: HTMLSpanElement,
  target: number,
  duration: number,
  generator: Generator,
) {
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const generated = generator(progress) * target;
    element.textContent = generated.toFixed(0);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}
