import { createPortal } from "react-dom";

const overlayRoot = document.getElementById("root");

export default function Overlay({ children, active, setActive }) {
  return createPortal(
    <section
      className={`
          fixed inset-0 z-50 flex items-end md:hidden
          bg-black/50 backdrop-blur-sm transition-all duration-750
          ${active ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      onClick={() => setActive(false)}>
      <article
        onClick={(e) => setActive(false)}
        className={`
            w-full rounded-t-2xl bg-neutral-100 p-5 pb-10
            shadow-2xl transform transition-all duration-750
            ${active ? "translate-y-0" : "translate-y-full"}
          `}>
        {children}
      </article>
    </section>,
    overlayRoot
  );
}
