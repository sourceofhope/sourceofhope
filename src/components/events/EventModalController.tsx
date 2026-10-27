"use client";

import { useSearchParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import EventDetailsModal from "@/components/events/EventDetailsModal";
import { EVENT_PARAM, closeEvent } from "@/components/events/event-url";
import type { EventView } from "@/lib/event-view";

const TITLE_ID = "event-modal-title";

/**
 * Opens the details modal for `?event=<key>`. Render inside <Suspense> so the
 * rest of /events stays statically rendered (useSearchParams opts this
 * subtree into client rendering).
 */
export default function EventModalController({ events }: { events: EventView[] }) {
  const searchParams = useSearchParams();
  const key = searchParams.get(EVENT_PARAM);
  const active = key ? events.find((event) => event.key === key) : undefined;

  return (
    <Modal open={Boolean(active)} onClose={closeEvent} labelledBy={TITLE_ID}>
      {active && <EventDetailsModal key={active.key} event={active} titleId={TITLE_ID} />}
    </Modal>
  );
}
