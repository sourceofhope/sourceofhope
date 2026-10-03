import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Heading from "@/components/ui/Heading";
import { ASSET_VERSION } from "@/lib/environment";

/**
 * Downloadable volunteer documents. To update a document, replace the PDF in
 * /public/v2/documents/ keeping the same file name.
 */
export const VOLUNTEER_DOCUMENTS = [
  {
    id: "general",
    title: "Volunteer Agreement",
    description:
      "Our general volunteer agreement for all Source of Hope programs and events.",
    href: `/${ASSET_VERSION}/documents/TSOH-Volunteer-Agreement.pdf`,
  },
  {
    id: "serving-hope",
    title: "Serving Hope Volunteer Agreement",
    description:
      "Required for volunteers serving meals with our monthly Serving Hope program.",
    href: `/${ASSET_VERSION}/documents/TSOH-Serving-Hope-Volunteer-Agreement.pdf`,
  },
];

export default function ServeDocumentsSection({
  only,
}: {
  /** Limit the list to specific document ids. */
  only?: string[];
}) {
  const documents = only
    ? VOLUNTEER_DOCUMENTS.filter((doc) => only.includes(doc.id))
    : VOLUNTEER_DOCUMENTS;

  return (
    <PageSection className="py-10 text-sm md:text-md lg:text-lg">
      <div id="volunteer-agreements" className="scroll-mt-24" />
      <SectionHeading eyebrow="Before you serve" title="Volunteer Agreements">
        Please download, read, and sign the agreement for your program, then
        bring it with you or email it to{" "}
        <a
          className="font-semibold text-accent-500"
          href="mailto:info@thesourceofhope.org?subject=Signed Volunteer Agreement">
          info@thesourceofhope.org
        </a>
        .
      </SectionHeading>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {documents.map((doc) => (
          <li key={doc.id}>
            <a
              href={doc.href}
              download
              target="_blank"
              rel="noopener"
              className="no-underline! group h-full flex items-start gap-4 bg-neutral-50 hover:bg-neutral-100 rounded-2xl shadow-sm p-5 transition-colors duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-300">
              <DocumentTextIcon
                className="w-10 h-10 shrink-0 text-accent-500"
                aria-hidden="true"
              />
              <span className="grid gap-1 grow">
                <Heading>{doc.title}</Heading>
                <span className="text-sm text-neutral-600">
                  {doc.description}
                </span>
                <span className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-accent-600">
                  <ArrowDownTrayIcon
                    className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                  Download PDF
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
