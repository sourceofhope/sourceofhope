"use client";

import { useSearchParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import EventDetailsModal from "@/components/events/EventDetailsModal";
import { useSignedWaivers } from "@/components/events/useSignedWaivers";
import { toWaiverReturnStatus } from "@/components/events/waiver-status";
import {
  EVENT_PARAM,
  WAIVER_STATUS_PARAM,
  closeEvent,
} from "@/components/events/event-url";
import type { EventView } from "@/lib/event-view";

const TITLE_ID = "event-modal-title";

/**
 * Opens the details modal for `?event=<key>`. Render inside <Suspense> so the
 * rest of /events stays statically rendered (useSearchParams opts this
 * subtree into client rendering).
 */
export default function EventModalController({
  events,
  signingEnabled,
}: {
  events: EventView[];
  signingEnabled: boolean;
}) {
  const searchParams = useSearchParams();
  const signedWaivers = useSignedWaivers();
  const key = searchParams.get(EVENT_PARAM);
  const active = key ? events.find((event) => event.key === key) : undefined;
  const returnStatus = toWaiverReturnStatus(searchParams.get(WAIVER_STATUS_PARAM));

  return (
    <Modal open={Boolean(active)} onClose={closeEvent} labelledBy={TITLE_ID}>
      {active && (
        <EventDetailsModal
          key={active.key}
          event={active}
          titleId={TITLE_ID}
          signingEnabled={signingEnabled}
          signedWaivers={signedWaivers}
          returnStatus={returnStatus}
        />
      )}
    </Modal>
  );
}
