import Image from "next/image";
import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Heading from "@/components/ui/Heading";
import HighlightedText from "@/components/ui/HighlightedText";
import { LinkButton } from "@/components/ui/Button";
import FormSection from "@/components/planned-giving/FormSection";
import { ASSET_VERSION } from "@/lib/environment";
import {
  DocumentCheckIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  UserIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";

const CANONICAL_URL = "https://thesourceofhope.org/planned-giving";

export const metadata: Metadata = {
  title: "Planned Giving | The Source of Hope",
  description:
    "Leave a lasting legacy with The Source of Hope through planned giving. Learn how bequests, trusts, and beneficiary designations can create transformational impact for generations to come.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Planned Giving | The Source of Hope",
    description:
      "Secure the future of The Source of Hope through planned giving. Discover how legacy gifts through wills, trusts, and retirement accounts create lasting impact in the DFW community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planned Giving | The Source of Hope",
    description:
      "Leave a legacy of hope. Explore planned giving options with The Source of Hope and ensure your values live on for generations.",
  },
};

export default function PlannedGivingPage() {
  return (
    <>
      <PageHeader
        src={`/${ASSET_VERSION}/servingHope/Carousel-7.webp`}
        title="PLANNED GIVING"
        subtitle="LEAVE A LASTING LEGACY"
      />
      <IntroductionSection />
      <WaysSection />
      <ImpactSection />
      <JourneySection />
      <FormSection />
      <ReassuranceSection />
    </>
  );
}

function IntroductionSection() {
  return (
    <PageSection className="gap-10 pb-15 lg:grid-cols-2 items-center">
      <div className="grid gap-5">
        <SectionHeading
          eyebrow="Your legacy, their hope"
          title={
            <>
              Create <HighlightedText>hope for generations</HighlightedText>
            </>
          }
        />
        <div className="grid gap-4 text-neutral-600">
          <p className="font-semibold text-primary-800">
            What you leave behind can do more than change lives today. It can
            create hope for generations to come.
          </p>
          <p>
            Through planned giving, your values and compassion can continue
            making a difference long after you&apos;re gone.
          </p>
        </div>
        <div className="flex gap-5 flex-col sm:flex-row">
          <LinkButton
            className="w-fit"
            href="#form-section"
            text="BEGIN YOUR LEGACY"
          />
          <LinkButton className="w-fit" href="/members" text="GIVE MONTHLY" />
        </div>
      </div>
      <div className="relative w-full aspect-square md:aspect-auto md:h-96 rounded-2xl overflow-hidden shadow-md bg-neutral-200">
        <Image
          src={`/${ASSET_VERSION}/core/plannedgiving_hero.webp`}
          alt="A Source of Hope volunteer in a food-service glove speaking into a microphone"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </PageSection>
  );
}

const ways = [
  {
    icon: DocumentCheckIcon,
    title: "In Your Will or Trust",
    text: "A simple way to leave a lasting gift that reflects your values.",
  },
  {
    icon: BriefcaseIcon,
    title: "Retirement Accounts",
    text: "Name The Source of Hope as a beneficiary of your IRA, 401(k), or other plan.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Life Insurance",
    text: "Name The Source of Hope as a beneficiary of an existing or new life insurance policy to make a meaningful future gift.",
  },
  {
    icon: ChartBarIcon,
    title: "Stocks & Investments",
    text: "Donate appreciated securities and help our mission while receiving tax benefits.",
  },
  {
    icon: HomeIcon,
    title: "Real Estate & Land",
    text: "Leave a home, land, or property to support hope for generations to come.",
  },
  {
    icon: BuildingOfficeIcon,
    title: "Business Interests",
    text: "Business owners may leave a portion of their business to support our mission.",
  },
];

function WaysSection() {
  return (
    <PageSection className="bg-neutral-200 py-15">
      <SectionHeading eyebrow="Your options" title="Ways to Leave a Legacy" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ways.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="grid content-start gap-3 bg-neutral-50 rounded-2xl shadow-sm p-5 border-t-4 border-accent-500">
            <Icon className="w-10 h-10 text-accent-500" aria-hidden="true" />
            <h3 className="font-urbanist font-bold text-lg text-primary-800">
              {title}
            </h3>
            <p className="text-sm text-neutral-600">{text}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

const impacts = [
  {
    icon: UsersIcon,
    title: "Stronger Families",
    text: "Providing stability, resources, and hope when families need it most.",
  },
  {
    icon: AcademicCapIcon,
    title: "Brighter Futures",
    text: "Opening doors to education and opportunity so students can reach their potential.",
  },
  {
    icon: HeartIcon,
    title: "Compassionate Care",
    text: "Supporting seniors with dignity, respect, and the care they deserve.",
  },
  {
    icon: UserIcon,
    title: "Supporting Veterans",
    text: "Honoring those who served by walking alongside them in their next chapter.",
  },
  {
    icon: UserGroupIcon,
    title: "Thriving Communities",
    text: "Building stronger, more hopeful communities together.",
  },
];

function ImpactSection() {
  return (
    <PageSection className="bg-accent-800 py-15">
      <SectionHeading
        inverted
        eyebrow="What your gift makes possible"
        title="The Impact of Your Legacy"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {impacts.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="grid content-start gap-3 rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5">
            <Icon className="w-10 h-10 text-accent-300" aria-hidden="true" />
            <h3 className="font-urbanist font-bold text-lg text-neutral-50">
              {title}
            </h3>
            <p className="text-sm text-neutral-300">{text}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

const steps = [
  {
    title: "Explore Your Legacy",
    text: "Think about the impact you'd like to leave for future generations.",
  },
  {
    title: "Have a Conversation",
    text: "Reach out to us confidentially. We'll answer your questions and explain your options.",
  },
  {
    title: "Meet With Your Attorney",
    text: "Your attorney can help you include us in your will, trust, or estate plans.",
  },
  {
    title: "Leave a Legacy of Hope",
    text: "Your gift will one day help families, veterans, seniors, and students.",
  },
];

function JourneySection() {
  return (
    <PageSection className="py-15">
      <SectionHeading eyebrow="Four simple steps" title="Your Legacy Journey" />
      <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map(({ title, text }, index) => (
          <li
            key={title}
            className="grid content-start gap-3 bg-neutral-50 rounded-2xl shadow-sm p-5">
            <span className="w-12 h-12 rounded-full bg-primary-800 text-neutral-50 font-urbanist text-xlg font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <h3 className="font-urbanist font-bold text-lg text-primary-800">
              {title}
            </h3>
            <p className="text-sm text-neutral-600">{text}</p>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}

const reassurances = [
  {
    icon: HeartIcon,
    text: "Planned giving isn't only for wealthy individuals. Any gift, of any size, can create lasting hope.",
  },
  {
    icon: ShieldCheckIcon,
    text: "You can support your family and still leave a legacy that makes a difference.",
  },
  {
    icon: UserIcon,
    text: "Many supporters continue giving during their lifetime while also including a future gift.",
  },
  {
    icon: ChatBubbleLeftIcon,
    text: "Already included The Source of Hope in your plans? We'd love to hear from you.",
  },
];

function ReassuranceSection() {
  return (
    <PageSection className="bg-neutral-200 py-15">
      <Heading>Good to know</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {reassurances.map(({ icon: Icon, text }) => (
          <div key={text} className="flex gap-3 items-start">
            <Icon
              className="w-8 h-8 shrink-0 text-accent-500"
              aria-hidden="true"
            />
            <p className="text-sm text-neutral-700 font-medium">{text}</p>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
