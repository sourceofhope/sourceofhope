import Image from "next/image";
import { SparklesIcon } from "@heroicons/react/24/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Heading from "@/components/ui/Heading";
import HighlightedText from "@/components/ui/HighlightedText";
import { LinkButton } from "@/components/ui/Button";
import { ASSET_VERSION } from "@/lib/environment";
import { FOUNDING_SPONSOR_DEADLINE_LABEL } from "@/lib/sponsor-launch";

// Same figures as the home page's Community Impact section.
const stats = [
  { value: "353K+", label: "Free meals served" },
  { value: "273K+", label: "Volunteer hours" },
  { value: "$900K+", label: "Holistic aid provided" },
];

export default function MembersHeroSection({
  launchOpen,
}: {
  launchOpen: boolean;
}) {
  return (
    <PageSection className="gap-10 pb-15">
      {launchOpen && <LaunchCallout />}

      <div className="grid gap-10 lg:grid-cols-2 items-center">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow="Corporate responsibility, close to home"
            title={
              <>
                Help <HighlightedText>fill every table</HighlightedText>
              </>
            }
          />
          <div className="grid gap-4 text-neutral-600">
            <p className="font-semibold text-primary-800">
              Our volunteers have served more than 353,000 free meals to
              neighbors across Dallas–Fort Worth. Community Sponsors keep that
              work going every month.
            </p>
            <p>
              Community Sponsors are local businesses and neighbors who give
              monthly. Steady support lets us plan meals, wellness care, and
              education months ahead, not week to week.
            </p>
            <p>
              Your sponsorship also stays close to home. We welcome new sponsors
              with gift cards donated by our Community Partners and introduce
              them to local businesses that give back.
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            <LinkButton className="w-fit" href="#plans" text="BECOME A SPONSOR" />
            <LinkButton
              className="w-fit"
              href="#partner-inquiry"
              text="TALK WITH OUR TEAM"
            />
          </div>
        </div>
        <div className="relative w-full aspect-4/3 md:aspect-auto md:h-96 rounded-2xl overflow-hidden shadow-md bg-neutral-200">
          <Image
            src={`/${ASSET_VERSION}/servingHope/Carousel-2.webp`}
            alt="Business and community leaders standing with The Source of Hope team in front of event banners"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="grid gap-1 rounded-2xl bg-neutral-100 shadow-sm p-5 text-center">
            <dt className="order-2 text-sm text-neutral-600">{label}</dt>
            <dd className="order-1 font-urbanist font-bold text-xxlg text-primary-800">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </PageSection>
  );
}

function LaunchCallout() {
  return (
    <aside className="relative overflow-hidden grid gap-5 md:grid-cols-[1fr_auto] md:items-center rounded-2xl bg-accent-800 p-5 md:p-8 text-neutral-50">
      <div className="relative z-10 grid gap-2">
        <Heading className="text-accent-300!">Thanksgiving launch</Heading>
        <p className="font-urbanist font-semibold text-xlg md:text-xxlg leading-tight text-balance">
          Become a Founding Sponsor
        </p>
        <p className="text-neutral-300 max-w-[65ch]">
          This Thanksgiving, we&apos;re inviting local businesses to pull up a
          chair. Sponsors who join by {FOUNDING_SPONSOR_DEADLINE_LABEL} are
          recognized as Founding Sponsors on our website and social channels.
        </p>
      </div>
      <div className="relative z-10 w-fit">
        <LinkButton href="#plans" text="BECOME A FOUNDING SPONSOR" />
      </div>
      <SparklesIcon
        aria-hidden="true"
        className="absolute -right-4 -bottom-4 size-32 text-accent-300 opacity-15"
      />
    </aside>
  );
}
