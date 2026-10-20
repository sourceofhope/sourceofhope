import {
  ArrowPathIcon,
  BuildingStorefrontIcon,
  GiftIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { WELCOME_GIFT_MIN_MONTHLY } from "@/lib/community-partners";

const steps = [
  {
    icon: HeartIcon,
    title: "You give monthly",
    text: "Your sponsorship sustains meals, wellness care, and education for families across DFW.",
  },
  {
    icon: GiftIcon,
    title: "We say thank you",
    text: `Sponsors giving $${WELCOME_GIFT_MIN_MONTHLY} or more a month receive a welcome gift card donated by one of our Community Partners, while supplies last.`,
  },
  {
    icon: BuildingStorefrontIcon,
    title: "You shop local",
    text: "Visit partner businesses like 12 Cuts Brazilian Steakhouse and use their HOPE code when you do.",
  },
  {
    icon: ArrowPathIcon,
    title: "The circle grows",
    text: "Partners give a portion back to our programs and meet new customers who share their values.",
  },
];

export default function MembersCircleSection() {
  return (
    <PageSection className="bg-accent-800 py-15">
      <SectionHeading
        inverted
        eyebrow="How sponsorship works"
        title="Hope that comes full circle">
        Every sponsorship supports families and the local businesses that
        support them.
      </SectionHeading>
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li
            key={title}
            className="grid content-start gap-3 rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 shrink-0 rounded-full bg-neutral-50 text-primary-800 font-urbanist text-lg font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <Icon className="w-8 h-8 text-accent-300" aria-hidden="true" />
            </div>
            <h3 className="font-urbanist font-bold text-lg text-neutral-50">
              {title}
            </h3>
            <p className="text-sm text-neutral-300">{text}</p>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
