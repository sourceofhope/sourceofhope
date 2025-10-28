import { useState } from "react";
import PageSection from "../../PageSection";
import { NavLink } from "react-router-dom";

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
            We welcome volunteers of all ages, from kids and students to adults
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
      <GuidelinesCard title="What should I bring?">
        <div className="grid gap-3">
          <p className="md:text-balance">
            We recommend dressing comfortably and appropriately for the
            activity. Closed-toe shoes are required for safety, and we suggest
            wearing clothing you don’t mind getting a little messy.
          </p>
          <ul className="list-disc pl-4">
            <li>Reusable water bottle to stay hydrated</li>
            <li>
              Weather-appropriate clothing (hat, sunscreen, or light jacket)
            </li>
            <li>A positive attitude and willingness to serve</li>
          </ul>
          <p className="md:text-balance">
            All tools and materials needed for the day’s activities will be
            provided unless stated otherwise.
          </p>
        </div>
      </GuidelinesCard>
      <GuidelinesCard title="How do I sign up?">
        <div className="grid gap-3">
          <p className="md:text-balance">
            Signing up is simple! You can register through our online volunteer
            form or reach out to us directly by email.
          </p>
          <ul className="list-disc pl-4">
            <li>
              Visit{" "}
              <NavLink
                className="font-semibold text-accent-500"
                to="/volunteer"
                target="_blank"
                rel="noopener noreferrer"
              >
                thesourceofhope.org/volunteer
              </NavLink>
            </li>
            <li>
              Or email us at{" "}
              <a
                className="font-semibold text-accent-500"
                href="mailto:info@thesourceofhope.org?subject=Volunteer Sign-up"
              >
                info@thesourceofhope.org
              </a>
            </li>
          </ul>
          <p className="md:text-balance">
            Once registered, you’ll receive a confirmation and details about
            your volunteer shift.
          </p>
        </div>
      </GuidelinesCard>
      <GuidelinesCard title="Can I volunteer as a group?">
        <div className="grid gap-3">
          <p className="md:text-balance">
            Absolutely! We welcome group volunteers from schools, churches,
            clubs, and companies. Volunteering together strengthens teamwork and
            builds community connections.
          </p>
          <p className="md:text-balance">
            To coordinate a group, please{" "}
            <a
              className="font-semibold text-accent-500"
              href="mailto:info@thesourceofhope.org?subject=Group Volunteering Inquiry"
            >
              contact us
            </a>{" "}
            in advance so we can plan a project that fits your group size and
            interests.
          </p>
        </div>
      </GuidelinesCard>
      <GuidelinesCard title="What if I need to cancel?">
        <div className="grid gap-3">
          <p className="md:text-balance">
            We understand that plans can change. If you’re unable to attend for
            volunteering, please let us know as soon as possible so we can
            offer your spot to someone else.
          </p>
          <ul className="list-disc pl-4">
            <li>Notify us at least 24 hours in advance if you can</li>
            <li>
              Email us at{" "}
              <a
                className="font-semibold text-accent-500"
                href="mailto:info@thesourceofhope.org?subject=Volunteer Cancellation"
              >
                info@thesourceofhope.org
              </a>
            </li>
          </ul>
          <p className="md:text-balance">
            Your communication helps us stay organized and ensures every event
            runs smoothly.
          </p>
        </div>
      </GuidelinesCard>
      <GuidelinesCard title="Do I need experience?">
        <div className="grid gap-3">
          <p className="md:text-balance">
            No prior experience is needed! Our team will guide you through each
            task and make sure you’re comfortable with what you’re doing.
          </p>
          <p className="md:text-balance">
            We believe every volunteer brings unique strengths, whether it’s
            teamwork, compassion, or creativity — and every helping hand makes a
            difference.
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
          open ? "max-h-screen mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"
        } overflow-hidden transition-all duration-750`}>
        {children}
      </div>
    </div>
  );
}
