import { useEffect, useState, useRef } from "react";

export const Generator = {
  LINEAR: (interval) => interval,
  EASE_IN: (interval) => Math.pow(interval, Math.E),
  EASE_OUT: (interval) => 1 - Math.pow(1 - interval, Math.E),
  EASE_IN_OUT: (interval) =>
    interval < 0.5
      ? 0.5 * Math.pow(2 * interval, Math.E)
      : 1 - 0.5 * Math.pow(2 * (1 - interval), Math.E),
};

export default function ExpressiveNumber({
  start = 0,
  end,
  duration = 5000,
  threshold = 0.1,
  generator = Generator.LINEAR,
  ariaLive = "polite",
}) {
  const reference = useRef(null);
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
  }, []);

  useEffect(() => {
    if (!inView) return;

    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const normalProgress = Math.min((currentTime - startTime) / duration, 1);
      const generatedProgress = generator(normalProgress);

      const currentValue = Math.round(
        start + (end - start) * generatedProgress
      );
      setValue(currentValue);

      if (normalProgress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, start, end, duration, generator]);

  return (
    <p aria-live={ariaLive} ref={reference}>
      {value}
    </p>
  );
}
