"use client";

import { createPortal } from "react-dom";

interface TakeoverProps {
  children: React.ReactNode;
  active: boolean;
  setActive: (active: boolean) => void;
  className?: string;
}

export default function Takeover({
  className = "",
  children,
  active,
  setActive,
}: TakeoverProps) {
  return createPortal(
    <section
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        transition-opacity duration-700
        ${active ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={() => setActive(false)}>
      <div className={className} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </section>,
    document.body,
  );
}
