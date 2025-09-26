// ExpressiveText.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { DefaultGenerator } from "./DefaultGenerator";

function mapCurve(
  curveFunction,
  { minimum = 50, maximum = 150, pause = 1000 } = {}
) {
  return (percent, state) => {
    switch (state) {
      case States.TYPE:
      case States.DELETE: {
        const output = curveFunction(percent);
        return minimum + (maximum - minimum) * output;
      }
      case States.PAUSE:
        return pause;
      default:
        return minimum;
    }
  };
}

export const States = {
  TYPE: 0,
  DELETE: 1,
  PAUSE: 2,
};

export const TypedGenerator = {
  LINEAR: (options) => mapCurve(DefaultGenerator.LINEAR, options),
  EASE_IN: (options) => mapCurve(DefaultGenerator.EASE_IN, options),
  EASE_OUT: (options) => mapCurve(DefaultGenerator.EASE_OUT, options),
  EASE_IN_OUT: (options) => mapCurve(DefaultGenerator.EASE_IN_OUT, options),
};

export function HighlightedText({
  children,
  className,
  start = 0,
  end = 1,
  duration = 500,
  threshold = 0.1,
  generator = DefaultGenerator.LINEAR,
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

      const currentValue = 
        start + (end - start) * generatedProgress;

      setValue(currentValue);

      if (normalProgress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, start, end, duration, generator]);

  return (
    <span
      ref={reference}
      aria-live={ariaLive}
      style={{ ["--hl-w"]: `${value * 100}%` }}
      className={`
        relative inline-block align-baseline
        after:content-[''] after:absolute after:left-0 after:bottom-0
        after:block after:h-1/2 after:[width:var(--hl-w)]
        after:bg-yellow-400 after:z-0
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
}

export function TypedText({
  items = [],
  initial = States.TYPE,
  generator = LINEAR,
  showCursor = true,
  ariaLive = "polite",
}) {
  const [state, setState] = useState(initial);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const timerReference = useRef(null);

  const target = items[index] ?? "";
  const targetLength = target.length;
  const textLength = text.length;

  const progress = useMemo(() => {
    if (targetLength === 0) {
      return 1;
    }
    switch (state) {
      case States.TYPE:
        return textLength / targetLength;
      case States.DELETE:
        return (targetLength - textLength) / targetLength;
      default:
        return 0;
    }
  }, [state, textLength, targetLength]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const typingDelay = Math.max(0, Number(generator(progress, state)) || 0);

    const typingStep = () => {
      switch (state) {
        case States.TYPE: {
          const typingNext = target.slice(0, textLength + 1);
          setText(typingNext);
          if (typingNext.length === targetLength) {
            setState(States.PAUSE);
          }
          break;
        }
        case States.DELETE: {
          const typingNext = target.slice(0, textLength - 1);
          if (typingNext.length === 0) {
            const typingIndex = (index + 1) % items.length;
            setIndex(typingIndex);
            setText("");
            setState(States.TYPE);
          } else {
            setText(typingNext);
          }
          break;
        }
        case States.PAUSE: {
          setState(States.DELETE);
          break;
        }
        default: {
          break;
        }
      }
    };

    timerReference.current = setTimeout(typingStep, typingDelay);
    return () => clearTimeout(timerReference.current);
  }, [
    items.length,
    generator,
    progress,
    state,
    textLength,
    targetLength,
    target,
    index,
  ]);

  return (
    <span aria-live={ariaLive}>
      {text}
      {showCursor && <span className="expressive-cursor">|</span>}
    </span>
  );
}
