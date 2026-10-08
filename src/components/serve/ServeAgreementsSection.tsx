import { ArrowDownTrayIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import { ASSET_VERSION } from "@/lib/environment";

// PDFs live in public/<ASSET_VERSION>/serve/. Replace a file in place to update it.
const AGREEMENTS = [
  {
    title: "Volunteer Agreement",
    description:
      "For all volunteers serving with The Source of Hope across our programs and events.",
    file: "TSOH-Volunteer-Agreement.pdf",
  },
  {
    title: "Serving Hope Volunteer Agreement",
    description:
      "For volunteers joining Serving Hope, our monthly meal preparation and community serving outreach.",
    file: "TSOH-Serving-Hope-Volunteer-Agreement.pdf",
  },
];

export default function ServeAgreementsSection() {
  return (
    <PageSection
      id="volunteer-agreements"
      className="gap-5 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start">
        <Heading>Before you serve</Heading>
        <Title className="text-balance">Volunteer Agreements</Title>
      </div>
      <p className="text-neutral-600 max-w-[75ch]">
        Download the agreement that applies to your volunteer role. Questions
        about which one you need? Email us at{" "}
        <a
          className="font-semibold text-accent-500"
          href="mailto:info@thesourceofhope.org?subject=Volunteer Agreement Question">
          info@thesourceofhope.org
        </a>
        .
      </p>
      <ul className="grid gap-5 md:grid-cols-2">
        {AGREEMENTS.map(({ title, description, file }) => (
          <li
            key={file}
            className="flex flex-col gap-3 rounded-2xl bg-neutral-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-500">
                <DocumentTextIcon className="size-6" aria-hidden="true" />
              </span>
              <div className="grid gap-1">
                <Heading className="leading-tight">{title}</Heading>
                <p className="text-sm md:text-md text-neutral-600">
                  {description}
                </p>
              </div>
            </div>
            <a
              href={`/${ASSET_VERSION}/serve/${file}`}
              download={file}
              aria-label={`Download the ${title} (PDF)`}
              className="group mt-auto inline-flex w-fit items-center gap-3 rounded-2xl bg-accent-500 px-6 py-3 text-sm md:text-md font-semibold text-neutral-50 no-underline! transition-colors duration-300 hover:bg-accent-600">
              <ArrowDownTrayIcon
                className="size-[1em] transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
              DOWNLOAD PDF
            </a>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
