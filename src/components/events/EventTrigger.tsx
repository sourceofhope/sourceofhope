"use client";

import { ReactNode } from "react";
import { openEvent } from "@/components/events/event-url";

interface EventTriggerProps {
  eventKey: string;
  /** Accessible name, e.g. "View details for Hope Run for Hunger". */
  label: string;
  children: ReactNode;
  className?: string;
}

/** Opens the event details modal. Its children are rendered on the server. */
export default function EventTrigger({
  eventKey,
  label,
  children,
  className = "",
}: EventTriggerProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      onClick={() => openEvent(eventKey)}
      className={`text-left cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-300 ${className}`}>
      {children}
    </button>
  );
}
