"use client";

import { useEffect, useRef } from "react";

interface ExpressiveNumberProps {
  end: number;
  caption: string;
  pre?: string;
  post?: string;
}

export function ExpressiveNumber({
  end,
  caption,
  pre = "",
  post = "",
}: ExpressiveNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !spanRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        animateNumber(spanRef.current!, end, 2000);
      }
    });

    observer.observe(spanRef.current);
    return () => observer.disconnect();
  }, [end]);

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
  duration: number
) {
  const start = 0;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start + (target - start) * progress);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}
