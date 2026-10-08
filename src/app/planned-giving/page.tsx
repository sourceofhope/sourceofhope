import Image from "next/image";
import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import HighlightedText from "@/components/ui/HighlightedText";
import { LinkButton } from "@/components/ui/Button";
import FormSection from "@/components/planned-giving/FormSection";
import { ASSET_VERSION } from "@/lib/environment";
import {
  HeartIcon,
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

const WAYS_TO_GIVE = [
  {
    title: "In Your Will or Trust",
    text: "A simple way to leave a lasting gift that reflects your values.",
    icon: DocumentCheckIcon,
  },
  {
    title: "Retirement Accounts",
    text: "Name The Source of Hope as a beneficiary of your IRA, 401(k), or other plan.",
    icon: BriefcaseIcon,
  },
  {
    title: "Life Insurance",
    text: "Name The Source of Hope as a beneficiary of an existing or new life insurance policy to make a meaningful future gift.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Stocks & Investments",
    text: "Donate appreciated securities and help our mission while receiving tax benefits.",
    icon: ChartBarIcon,
  },
  {
    title: "Real Estate & Land",
    text: "Leave a home, land, or property to support hope for generations to come.",
    icon: HomeIcon,
  },
  {
    title: "Business Interests",
    text: "Business owners may leave a portion of their business to support our mission.",
    icon: BuildingOfficeIcon,
  },
];

const IMPACT_AREAS = [
  {
    title: "Stronger Families",
    text: "Providing stability, resources, and hope when families need it most.",
    icon: UsersIcon,
  },
  {
    title: "Brighter Futures",
    text: "Opening doors to education and opportunity so students can reach their potential.",
    icon: AcademicCapIcon,
  },
  {
    title: "Compassionate Care",
    text: "Supporting seniors with dignity, respect, and the care they deserve.",
    icon: HeartIcon,
  },
  {
    title: "Supporting Veterans",
    text: "Honoring those who served by walking alongside them in their next chapter.",
    icon: UserIcon,
  },
  {
    title: "Thriving Communities",
    text: "Building stronger, more hopeful communities together.",
    icon: UserGroupIcon,
  },
];

const JOURNEY_STEPS = [
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

const REASSURANCES = [
  {
    text: "Planned giving isn't only for wealthy individuals. Any gift, of any size, can create lasting hope.",
    icon: HeartIcon,
  },
  {
    text: "You can support your family and still leave a legacy that makes a difference.",
    icon: ShieldCheckIcon,
  },
  {
    text: "Many supporters continue giving during their lifetime while also including a future gift.",
    icon: UserIcon,
  },
  {
    text: "Already included The Source of Hope in your plans? We'd love to hear from you.",
    icon: ChatBubbleLeftIcon,
  },
];

export default function PlannedGivingPage() {
  return (
    <>
      <PageHeader
        src={`/${ASSET_VERSION}/servingHope/Carousel-7.webp`}
        title="PLANNED GIVING"
        subtitle="LEAVE A LASTING LEGACY"
      />
      <IntroSection />
      <WaysToGiveSection />
      <ImpactSection />
      <JourneySection />
      <FormSection />
      <ReassuranceSection />
    </>
  );
}

function IntroSection() {
  return (
    <PageSection className="md:grid-cols-2 items-center text-sm md:text-md lg:text-lg">
      <div className="grid gap-5">
        <div className="grid gap-1 justify-self-start">
          <Heading>Your legacy</Heading>
          <Title className="text-balance">
            Your Legacy. <HighlightedText>Their Hope.</HighlightedText>
          </Title>
        </div>
        <p className="font-semibold text-primary-800">
          What you leave behind can do more than change lives today. It can
          create hope for generations to come.
        </p>
        <p className="text-neutral-600">
          Through planned giving, your values and compassion can continue making
          a difference long after you&apos;re gone.
        </p>
        <LinkButton
          href="#form-section"
          text="BEGIN YOUR LEGACY JOURNEY"
          className="w-fit"
        />
      </div>
      <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
        <Image
          src={`/${ASSET_VERSION}/plannedgiving/plannedgiving_hero.webp`}
          alt="A Source of Hope volunteer in a food-service glove speaking into a microphone"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </PageSection>
  );
}

function WaysToGiveSection() {
  return (
    <PageSection className="bg-neutral-200 py-10 gap-5">
      <div className="grid gap-1 justify-self-start">
        <Heading>Ways to give</Heading>
        <Title>Ways to Leave a Legacy</Title>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {WAYS_TO_GIVE.map(({ title, text, icon: WayIcon }) => (
          <article
            key={title}
            className="grid content-start gap-3 rounded-2xl bg-neutral-100 p-5 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-50 text-accent-500">
              <WayIcon className="size-6" aria-hidden="true" />
            </span>
            <Heading>{title}</Heading>
            <p className="text-sm md:text-md text-neutral-600">{text}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

function ImpactSection() {
  return (
    <section className="w-full grid gap-5 bg-accent-800 px-5 py-10 lg:px-35 text-neutral-50">
      <Title className="text-neutral-50">The Impact of Your Legacy</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {IMPACT_AREAS.map(({ title, text, icon: AreaIcon }) => (
          <article
            key={title}
            className="grid content-start justify-items-center gap-2 rounded-2xl border border-neutral-50/10 bg-neutral-50/5 p-5 text-center">
            <AreaIcon className="size-10 text-accent-200" aria-hidden="true" />
            <h3 className="font-urbanist text-lg font-semibold">{title}</h3>
            <p className="text-sm text-neutral-300">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <PageSection className="py-10 gap-5">
      <div className="grid gap-1 justify-self-start">
        <Heading>Four simple steps</Heading>
        <Title>Your Legacy Journey</Title>
      </div>
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {JOURNEY_STEPS.map(({ title, text }, index) => (
          <li key={title} className="grid content-start gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent-500 font-urbanist text-xlg font-bold text-neutral-50 shadow-sm">
              {index + 1}
            </span>
            <Heading>{title}</Heading>
            <p className="text-sm md:text-md text-neutral-600">{text}</p>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}

function ReassuranceSection() {
  return (
    <PageSection className="bg-neutral-200 py-10 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {REASSURANCES.map(({ text, icon: ReassuranceIcon }) => (
        <div key={text} className="flex flex-col items-start gap-3">
          <ReassuranceIcon className="size-8 text-accent-500" aria-hidden="true" />
          <p className="text-sm md:text-md font-medium text-neutral-700">
            {text}
          </p>
        </div>
      ))}
    </PageSection>
  );
}
