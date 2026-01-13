import { createPortal } from "react-dom";

const overlayRoot = document.getElementById("root");

export default function Takeover({
  className = "",
  children,
  active,
  setActive,
}) {
  return createPortal(
    <section
      className={`
        fixed inset-0 z-[990]
        flex items-center justify-center
        transition-opacity duration-700
        ${active ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={() => setActive(false)}>
      <div className={className} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </section>,
    overlayRoot
  );
}
