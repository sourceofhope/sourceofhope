'use client';

import { useEffect } from 'react';

interface OverlayProps {
  children: React.ReactNode;
  active: boolean;
  setActive: (active: boolean) => void;
}

export default function Overlay({ children, active, setActive }: OverlayProps) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [active]);

  return (
    <section
      className={`
        fixed inset-0 z-50 flex items-end md:hidden
        bg-black/50 backdrop-blur-sm transition-all duration-750
        ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={() => setActive(false)}
    >
      <article
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full rounded-t-2xl bg-neutral-100 p-5 pb-10
          shadow-2xl transform transition-all duration-750
          ${active ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {children}
      </article>
    </section>
  );
}
