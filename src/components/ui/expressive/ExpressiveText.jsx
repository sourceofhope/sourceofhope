// ExpressiveText.jsx
import { useEffect, useMemo, useRef, useState } from "react";

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

export const Generator = {
  LINEAR: (options) => mapCurve((interval) => interval, options),

  EASE_IN: (options) =>
    mapCurve((interval) => Math.pow(interval, Math.E), options),

  EASE_OUT: (options) =>
    mapCurve((interval) => 1 - Math.pow(1 - interval, Math.E), options),

  EASE_IN_PIT: (options) =>
    mapCurve(
      (interval) =>
        interval < 1 / 2
          ? 4 * Math.pow(interval, 3)
          : 1 - Math.pow(-2 * interval + 2, 3) / 2,
      options
    ),
};

export default function ExpressiveText({
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
