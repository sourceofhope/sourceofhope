"use client";

import { useSearchParams } from "next/navigation";
import { EVENT_PARAM, WAIVER_STATUS_PARAM } from "@/components/events/event-url";
import {
  WAIVER_STATUS_MESSAGES,
  WAIVER_STATUS_TONES,
  toWaiverReturnStatus,
} from "@/components/events/waiver-status";

/**
 * Result message after signing from the documents list (no event open).
 * Render inside <Suspense>; when an event is open its modal shows the result.
 */
export default function WaiverStatusNotice() {
  const searchParams = useSearchParams();
  const status = toWaiverReturnStatus(searchParams.get(WAIVER_STATUS_PARAM));
  if (!status || searchParams.has(EVENT_PARAM)) return null;

  const message = WAIVER_STATUS_MESSAGES[status];
  return (
    <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${WAIVER_STATUS_TONES[message.tone]}`}>
      {message.text}
    </p>
  );
}
