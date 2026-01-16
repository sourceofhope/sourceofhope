import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Heading from "../../../components/ui/text/Heading";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

export default function StorefrontFooterSection() {
  return (
    <section className="space-y-10 w-full p-5 lg:px-35 bg-white text-neutral-900">
      <div className="grid gap-5">
        <Heading>Shop Beyond Our Store</Heading>
        <p className="text-neutral-600">
          We've partnered with incredible community businesses who believe in
          our mission. When you shop or book using the links below, a portion of
          your purchase goes directly back to fund our programs: feeding
          families, empowering students, and strengthening communities.
        </p>
      </div>
      <div className="max-w-4xl mx-auto grid gap-6 text-center">
        <h3 className="font-semibold">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Step
            number="1"
            text="Navigate to one of our community partners below"
          />
          <Step number="2" text="Use your exclusive HOPE promo code" />
          <Step
            number="3"
            text="You get a discount, and we receive a donation!"
          />
        </div>
      </div>
      <div className="grid gap-10">
        <h3 className="font-semibold text-center">
          Featured Community Partners
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <PartnerCard
            name="12 Cuts Brazilian Steakhouse"
            action="Reserve a Table"
            code="SOURCEOFHOPE"
          />
          <PartnerCard
            name="Local Spa & Beauty Services"
            action="Visit Now"
            code="HOPEGLOW"
          />
          <PartnerCard
            name="Stone Global Realty"
            action="Learn More"
            note="Mention “The Source of Hope” when booking"
          />
          <PartnerCard
            name="Stone Construction"
            action="Learn More"
            note="Mention “The Source of Hope” when booking"
          />
          <PartnerCard
            name="Stone International Wellness Center"
            action="Book Now"
            code="HOPEWELLNESS10"
          />
        </div>
      </div>
    </section>
  );
}

function Step({ number, text }) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-sm">
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-accent-600 text-white font-semibold">
        {number}
      </div>
      <p className="text-neutral-600 text-sm text-center">{text}</p>
    </div>
  );
}

function PartnerCard({ name, action, code, note }) {
  return (
    <a className="group relative flex flex-col justify-between gap-5 p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm !no-underline">
      <h4 className="text-lg font-semibold">{name}</h4>
      <div className="flex flex-col gap-2 text-sm text-neutral-600">
        <span className="text-neutral-950 font-medium cursor-pointer">
          {action}
        </span>
        {code && (
          <span className="font-semibold">
            Use code:{" "}
            <HighlightedText className="text-neutral-950">
              {code}
            </HighlightedText>
          </span>
        )}
        {note && <span className="text-neutral-500 italic">{note}</span>}
      </div>
      <div className="w-fit">
        <div
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm md:text-md group inline-flex w-fit justify-between items-center gap-1 focus:outline-none text-accent-500 font-semibold">
          <span>Support the mission</span>
          <ArrowUpRightIcon
            className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </a>
  );
}
