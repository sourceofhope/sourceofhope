"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import WaiverSignForm from "@/components/events/WaiverSignForm";
import {
  WAIVER_STATUS_MESSAGES,
  WAIVER_STATUS_TONES,
  type WaiverReturnStatus,
} from "@/components/events/waiver-status";
import { WAIVERS, type WaiverId } from "@/lib/waivers";

interface WaiverPanelProps {
  waiverId: WaiverId;
  eventKey?: string;
  signingEnabled: boolean;
  signedOnThisDevice: boolean;
  returnStatus: WaiverReturnStatus | null;
}

/**
 * Soft prompt to sign the event's volunteer waiver before registering. It never
 * blocks registration; it explains, offers online signing (when DocuSign is
 * configured), and always offers the printable PDF.
 */
export default function WaiverPanel({
  waiverId,
  eventKey,
  signingEnabled,
  signedOnThisDevice,
  returnStatus,
}: WaiverPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const waiver = WAIVERS[waiverId];
  const message = returnStatus ? WAIVER_STATUS_MESSAGES[returnStatus] : null;
  const signed = signedOnThisDevice || returnStatus === "complete";

  return (
    <section
      aria-labelledby="waiver-panel-title"
      className="grid gap-3 rounded-2xl border border-neutral-300 p-5">
      {message && (
        <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${WAIVER_STATUS_TONES[message.tone]}`}>
          {message.text}
        </p>
      )}

      {signed ? (
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="size-7 shrink-0 text-green-700" aria-hidden="true" />
          <div className="grid gap-1">
            <h3 id="waiver-panel-title" className="font-semibold text-primary-800">
              {waiver.title} signed on this device
            </h3>
            <p className="text-sm text-neutral-600">
              One signature covers every Source of Hope event, so you&apos;re all
              set to register.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <DocumentTextIcon className="size-7 shrink-0 text-accent-600" aria-hidden="true" />
          <div className="grid gap-1">
            <h3 id="waiver-panel-title" className="font-semibold text-primary-800">
              Volunteering? Please sign the waiver first
            </h3>
            <p className="text-sm text-neutral-600">
              Before you register, please sign the <strong>{waiver.title}</strong>.
              You only need to sign it once; it covers every Source of Hope
              event until you let us know otherwise.
            </p>
            {!signingEnabled && (
              <p className="flex items-start gap-2 text-sm text-neutral-600">
                <InformationCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  Download and sign the PDF, then bring it with you or email it to{" "}
                  <a
                    className="font-semibold text-accent-600 break-words"
                    href="mailto:info@thesourceofhope.org?subject=Signed%20Volunteer%20Agreement">
                    info@thesourceofhope.org
                  </a>
                  .
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {showForm ? (
        <WaiverSignForm
          waiverId={waiverId}
          eventKey={eventKey}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="flex flex-wrap gap-3 text-sm">
          {signingEnabled && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className={`rounded-2xl px-5 py-3 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 ${
                signed
                  ? "text-accent-700 hover:bg-neutral-100"
                  : "bg-accent-500 text-neutral-50 hover:bg-accent-600"
              }`}>
              {signed ? "Sign for someone else" : "Sign online"}
            </button>
          )}
          <a
            href={waiver.href}
            download
            className="no-underline! inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold text-accent-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300">
            <ArrowDownTrayIcon className="size-4" aria-hidden="true" />
            Download PDF
          </a>
        </div>
      )}
    </section>
  );
}
