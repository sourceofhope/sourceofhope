import { ReactNode } from 'react';

export default function Icon({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`
        flex items-center justify-center select-none
        ${className}
      `}
    >
      {children}
    </div>
  );
}
