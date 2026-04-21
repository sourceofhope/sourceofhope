"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface OverlayProps {
  children: React.ReactNode;
  active: boolean;
  setActive: (active: boolean) => void;
}

export default function Overlay({ children, active, setActive }: OverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <section
      className={`
        fixed inset-0 z-50 flex items-end md:hidden
        bg-black/50 backdrop-blur-sm transition-all duration-700
        ${active ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={() => setActive(false)}>
      <article
        onClick={(e) => e.stopPropagation()} // <-- fix interaction bug
        className={`
          w-full rounded-t-2xl bg-neutral-100 p-5 pb-10
          shadow-2xl transform transition-all duration-700
          ${active ? "translate-y-0" : "translate-y-full"}
        `}>
        {children}
      </article>
    </section>,
    document.body,
  );
}
