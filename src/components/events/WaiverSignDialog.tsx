"use client";

import { useId, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";
import WaiverSignForm from "@/components/events/WaiverSignForm";
import { WAIVERS, type WaiverId } from "@/lib/waivers";

/** "Sign online" button for a waiver card, opening the DocuSign form in a modal. */
export default function WaiverSignDialog({ waiverId }: { waiverId: WaiverId }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const waiver = WAIVERS[waiverId];

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 rounded">
        <PencilSquareIcon className="size-4" aria-hidden="true" />
        Sign online
      </button>
      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId} className="max-w-xl">
        {open && (
          <div className="grid gap-4 p-6 md:p-8">
            <h2
              id={titleId}
              className="pr-10 font-urbanist text-xlg font-bold leading-tight text-primary-800">
              Sign the {waiver.title}
            </h2>
            <p className="text-sm text-neutral-600">
              {waiver.description} One signature covers every Source of Hope
              event until you let us know otherwise.
            </p>
            <WaiverSignForm waiverId={waiverId} onCancel={() => setOpen(false)} />
          </div>
        )}
      </Modal>
    </>
  );
}
