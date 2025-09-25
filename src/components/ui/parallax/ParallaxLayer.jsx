import { useMemo, useContext, createContext } from "react";

export const ParallaxContext = createContext({
  progress: 0,
  sectionHeight: 0,
  viewportHeight: 0,
});

export default function ParallaxLayer({
  children,
  className,
  overflow = 0.1,
  ratio = 1,
  layer = 0,
}) {
  const { progress, viewportHeight } = useContext(ParallaxContext);

  const overflowAmount = overflow * viewportHeight;
  const sectionTranslate = useMemo(() => {
    const maxOffset = (overflow / 2) * viewportHeight * ratio;
    return (progress - 0.5) * 2 * maxOffset;
  }, [ratio, viewportHeight, progress]);

  return (
    <div
      className="absolute inset-0 will-change-transform transition-transform"
      style={{ zIndex: layer * 10 }}
    >
      <div
        className={`absolute left-0 right-0 ${className}`}
        style={{
          height: `calc(100% + ${overflowAmount}px)`,
          top: `-${overflowAmount / 2}px`,
          transform: `translate3d(0, ${sectionTranslate}px, 0)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
