import { Suspense } from "react";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Heading from "@/components/ui/Heading";
import WaiverSignDialog from "@/components/events/WaiverSignDialog";
import WaiverStatusNotice from "@/components/events/WaiverStatusNotice";
import { isDocusignConfigured } from "@/lib/docusign.server";
import { WAIVERS, WAIVER_IDS, type WaiverId } from "@/lib/waivers";

/**
 * Volunteer waivers: printable PDFs, plus online signing through DocuSign
 * when it is configured. To update a document, replace the PDF in
 * /public/v2/documents/ keeping the same file name (see /src/lib/waivers.ts).
 */
export default function EventsDocumentsSection({
  only,
}: {
  /** Limit the list to specific waiver ids. */
  only?: WaiverId[];
}) {
  const ids = only ? WAIVER_IDS.filter((id) => only.includes(id)) : WAIVER_IDS;
  const signingEnabled = isDocusignConfigured();

  return (
    <PageSection className="py-10 text-sm md:text-md lg:text-lg">
      <div id="volunteer-agreements" className="scroll-mt-24" />
      <SectionHeading eyebrow="Before you serve" title="Volunteer Agreements">
        Every volunteer signs an agreement once; it covers all of your future
        Source of Hope events until you let us know otherwise.{" "}
        {signingEnabled ? "Sign online in a few minutes, or" : "Please"} download
        the PDF, sign it, and bring it with you or email it to{" "}
        <a
          className="font-semibold text-accent-500"
          href="mailto:info@thesourceofhope.org?subject=Signed Volunteer Agreement">
          info@thesourceofhope.org
        </a>
        . Volunteers under 18 also need a parent or guardian&apos;s signature.
      </SectionHeading>

      <Suspense fallback={null}>
        <WaiverStatusNotice />
      </Suspense>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ids.map((id) => {
          const waiver = WAIVERS[id];
          return (
            <li
              key={id}
              className="h-full flex items-start gap-4 bg-neutral-50 rounded-2xl shadow-sm p-5">
              <DocumentTextIcon
                className="w-10 h-10 shrink-0 text-accent-500"
                aria-hidden="true"
              />
              <div className="grid gap-1 grow">
                <Heading>{waiver.title}</Heading>
                <p className="text-sm text-neutral-600">{waiver.description}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                  {signingEnabled && <WaiverSignDialog waiverId={id} />}
                  <a
                    href={waiver.href}
                    download
                    className="no-underline! group inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 rounded">
                    <ArrowDownTrayIcon
                      className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-0.5"
                      aria-hidden="true"
                    />
                    Download PDF
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
}
