import { 
  useCallback, 
  useEffect, 
  useMemo, 
  useRef, 
  useState 
} from "react";
import { ParallaxContext } from "./ParallaxLayer";


export default function ParallaxSection({ children, className }) {
  const sectionReference = useRef(null);
  const [progress, setProgress] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  const updateProgress = useCallback(() => {
    const section = sectionReference.current;
    if (!section) {
      return;
    }

    const elementBounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    const viewportDistance = elementBounds.height + viewportHeight;
    const elementInside = viewportHeight - elementBounds.top;
    const elementProgress = Math.min(
      1,
      Math.max(0, viewportDistance > 0 ? elementInside / viewportDistance : 0)
    );

    setProgress(elementProgress);
    setSectionHeight(elementBounds.height);
    setViewportHeight(viewportHeight);
  }, []);

  useEffect(() => {
    updateProgress();

    let updating = false;

    const onScroll = () => {
      if (!updating) {
        updating = true;
        requestAnimationFrame(() => {
          updateProgress();
          updating = false;
        });
      }
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
    () => ({ progress, sectionHeight, viewportHeight }),
    [progress, sectionHeight, viewportHeight]
  );

  return (
    <section
      ref={sectionReference}
      className={`${className} relative top-0`}
    >
      <ParallaxContext.Provider value={context}>
        <div className="relative h-full w-full">
          {children}
        </div>
      </ParallaxContext.Provider>
    </section>
  );
}
