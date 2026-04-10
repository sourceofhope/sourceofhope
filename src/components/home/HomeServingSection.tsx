import ExpressiveLink from "@/components/ui/ExpressiveLink";
import ExpressiveAnchor from "@/components/ui/ExpressiveAnchor";
import Title from "@/components/ui/Title";
import PageSection from "@/components/ui/PageSection";

const ASSET_VERSION = "v2";

export default function HomeServingSection() {
  return (
    <PageSection className="hidden md:flex relative py-20 px-5 lg:px-35 bg-neutral-100 gap-8 items-center">
      <div className="flex-1 h-96 overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/" + ASSET_VERSION + "/core/TSOH-Service.webp"}
          alt="People cooking food at Serving Hope Event"
          className="w-full h-full object-cover brightness-75"
          loading="lazy"
        />
      </div>
      <ServingCard />
    </PageSection>
  );
}

function ServingCard() {
  return (
    <article className="flex flex-col gap-3 rounded-2xl shadow-2xl overflow-hidden lg:w-1/3 h-fit p-5 bg-neutral-50 text-neutral-950">
      <div className="px-5 text-sm font-semibold text-accent-600 uppercase tracking-wide">
        Get Involved
      </div>
      <Title className="px-5 text-balance text-2xl md:text-3xl">
        Let&lsquo;s Explore Your Next Steps, Together
      </Title>
      <ul className="grid text-sm">
        <li>
          <ExpressiveLink
            to="/members"
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors"
          >
            Become a Community Sponsor
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="/serve/educationHope"
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors"
          >
            Become a Tutor or Mentor
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors"
          >
            Volunteer for an Event
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="/connect"
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors"
          >
            Stay Connected
          </ExpressiveLink>
        </li>
        <li>
          <ExpressiveLink
            to="https://app.joinhandshake.com/e/806999/jobs"
            className="p-5 rounded-2xl hover:bg-neutral-200 duration-500 transition-colors"
          >
            Apply for Emerging Professional
          </ExpressiveLink>
        </li>
      </ul>
    </article>
  );
}
