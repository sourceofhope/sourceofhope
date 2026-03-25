'use client';

import { useEffect } from 'react';

interface TakeoverProps {
  children: React.ReactNode;
  active: boolean;
  setActive: (active: boolean) => void;
  className?: string;
}

/**
 * Notification component that displays a temporary message
 * Typically used for toast-like notifications (e.g., "Added to Cart")
 */
export default function Takeover({
  children,
  active,
  setActive,
  className = '',
}: TakeoverProps) {
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setActive(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [active, setActive]);

  return (
    <div
      className={`fixed bottom-20 right-5 md:right-10 z-[9998] transition-all duration-300 ${
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
}
