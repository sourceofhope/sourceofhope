import { useState } from "react";
import PageSection from "../../PageSection";

import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function ServeGuidelinesSection() {
  return (
    <PageSection className="gap-5">
      <div className="grid gap-1 justify-self-start justify-start text-sm md:text-md">
        <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
          View our Serving Guidelines
        </h2>
      </div>
      <GuidelinesCard title="Who can volunteer?">
        <div className="grid gap-3">
          <p className="md:text-balance">
            We welcome volunteers of all ages--from kids and students to adults
            and seniors! If you're looking to gain volunteer hours for school,
            participate as a family, or give back to your community, we have
            opportunities for everyone.
          </p>
          <p className="md:text-balance">
            For students, some local schools offer service hours for
            volunteering with us.{" "}
            <a
              className="font-semibold text-accent-500"
              href={`mailto:info@thesourceofhope.org?subject=High-school Participation Inquiry`}>
              Contact us
            </a>{" "}
            to check if your school participates.
          </p>
        </div>
      </GuidelinesCard>
      <GuidelinesCard title="What's expected of me?">
        <div className="grid gap-3">
          <p className="md:text-balance">
            We value every volunteer and their contributions. To ensure a
            meaningful and productive experience:
          </p>
          <ul className="list-disc pl-4">
            <li>Arrive on time and be ready to help</li>
            <li>Actively participate in tasks assigned by our team</li>
            <li>
              Respect our nonprofit’s mission and stay engaged throughout your
              shift
            </li>
            <li>If unsure of what to do, ask a team member for guidance</li>
          </ul>
          <p className="md:text-balance">
            By signing up, you acknowledge and agree to our volunteer terms and
            guidelines. Thank you for being the Source of Hope in our community!
          </p>
        </div>
      </GuidelinesCard>
    </PageSection>
  );
}

function GuidelinesCard({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`${
        open ? "bg-neutral-200" : "bg-neutral-50"
      } hover:bg-neutral-200 flex flex-col rounded-2xl shadow-2x overflow-hidden h-fit p-5 text-neutral-950 transition-colors duration-750`}>
      <div className="flex justify-between items-center text-primary-700">
        <h2 className="text-sm font-bold uppercase">{title}</h2>
        <ChevronDownIcon
          className={`w-[20px] h-[20px] transition-transform duration-750 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </div>
      <div
        className={`${
          open ? "max-h-70 mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"
        } overflow-hidden transition-all duration-750`}>
        {children}
      </div>
    </div>
  );
}
