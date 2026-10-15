import Image from "next/image";
import { Metadata } from "next";
import type { ReactNode } from "react";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Heading from "@/components/ui/Heading";
import Bold from "@/components/ui/Bold";
import HighlightedText from "@/components/ui/HighlightedText";
import { LinkButton } from "@/components/ui/Button";
import CallToActionSection from "@/components/ui/CallToActionSection";
import AwardsGalleryCard, {
  type GalleryItem,
} from "@/components/awards/AwardsGalleryCard";
import { ASSET_VERSION } from "@/lib/environment";
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  HeartIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";

const CANONICAL_URL = "https://thesourceofhope.org/media/awards";

export const metadata: Metadata = {
  title: "Awards & Recognition | The Source of Hope",
  description:
    "Explore the awards and recognitions honoring The Source of Hope and President Quynh Chau Stone for leadership, service, diversity, innovation, and community impact.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Awards & Recognition | The Source of Hope",
    description:
      "Discover more than a decade of awards and recognitions celebrating leadership, humanitarian service, community impact, and advocacy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awards & Recognition | The Source of Hope",
    description:
      "Explore the awards and recognitions received by The Source of Hope and Quynh Chau Stone.",
  },
};

const timelineItems = [
  {
    year: "2024",
    title: "Global Visionaries Convention - Champion of Change",
    description:
      "Recognized as a Champion of Change for sustained community leadership and advocacy.",
    tag: "Champion of Change",
    major: true,
  },
  {
    year: "2024",
    title: "Asian Hustle Network - Unsung Hero Award",
    description: "Honored for quiet, tireless service to the community.",
  },
  {
    year: "2021",
    title: "“You Can Live Again” Humanitarian Award",
    description:
      "Presented in recognition of humanitarian work and dedication to those in need.",
    tag: "Humanitarian",
  },
  {
    year: "2020",
    title: "Presidential Volunteer Service Award",
    description:
      "Recognized by the President of the United States for outstanding volunteer service and a deep commitment to community.",
    tag: "National honor",
    major: true,
  },
  {
    year: "2020",
    title: "Each Moment Matters Award",
    description:
      "Received at a veterans tribute where a World War II veteran served as the honored keynote speaker.",
  },
  {
    year: "2019",
    title: "PullCorpMedia Women of All Cultures Award",
    description: "Honored during Women’s History Month.",
  },
  {
    year: "2019",
    title: "Junior League of Collin County Spirit Award",
    description: "Recognized for community spirit and volunteer leadership.",
  },
  {
    year: "2018",
    title: "Featured & spotlighted - Women of All Cultures",
    description:
      "Featured on PullCorpMedia’s platform during Women’s History Month, and on the 10-year anniversary of the Women That Soar Award, aired across TV stations in 12 major states.",
  },
  {
    year: "2018",
    title: "“50 Inspiring Voices of Migrant Women”",
    description:
      "Featured in the book by Mireya Sula - foreword by Seema Malhotra, MP, with a contribution from Mary Ann Thompson Frenk.",
  },
  {
    year: "2018",
    title: "Against The Grain - Groundbreaker Award",
    description:
      "Honored for excellence in her career path, leadership that paved the way for others, and a servant’s heart for the community.",
  },
  {
    year: "2018",
    title: "Inspirique Circle of Light Award",
    description:
      "Presented in Beverly Hills, California, honoring her dedication to philanthropy and community service.",
  },
  {
    year: "2017",
    title: "GDAACC Beyond Boundaries Award",
    description:
      "Presented alongside Governor Greg Abbott at the GDAACC Annual Awards.",
  },
  {
    year: "2017",
    title: "Audrey Kaplan Inspiring Women Award",
    description:
      "Southwest Jewish Congress - featured in The Dallas Morning News.",
  },
  {
    year: "2016",
    title: "Women That Soar Community Outreach Award",
    description:
      "Hosted by Kevin Frazier, co-host of Entertainment Tonight. Featured in The Dallas Morning News and on Viet Face TV.",
  },
  {
    year: "2016",
    title: "Dallas, Texas State Proclamation",
    description:
      "Issued in recognition of The Source of Hope’s three years of community service.",
    tag: "Government proclamation",
    major: true,
  },
  {
    year: "2015",
    title: "GDAACC Women in Business Award",
    description: "Nominated for the Women in Business Award.",
  },
  {
    year: "2014",
    title: "Community Leadership Award",
    description: "Tarrant County Asian American Chamber of Commerce.",
  },
  {
    year: "2013",
    title: "GDAACC Awards Gala",
    description:
      "Recognized at the Greater Dallas Asian American Chamber of Commerce Awards Gala.",
  },
  {
    year: "2013",
    title: "GPCC - nominated in four categories",
    description: "Grand Prairie Chamber of Commerce recognition.",
  },
  {
    year: "2011",
    title: "Plano Profiles - “Women in Business”",
    description: "Featured in the magazine’s Women in Business edition.",
  },
  {
    year: "2010",
    title: "SBDC Small Business Award",
    description: "Awarded in Collin County.",
  },
];

const galleryItems: GalleryItem[] = [
  {
    src: `/${ASSET_VERSION}/core/awards-2024-uplifted.webp`,
    alt: "Recognized among Asian American community leaders",
    year: "2024 · Uplifted Conference",
    title: "Recognized among Asian American community leaders",
    position: "50% 24%",
  },
  {
    src: `/${ASSET_VERSION}/core/awards-2021-humanitarian.webp`,
    alt: "“You Can Live Again” - honored for humanitarian service",
    year: "2021 · Humanitarian Award",
    title: "“You Can Live Again” - honored for humanitarian service",
    position: "68% 42%",
  },
  {
    src: `/${ASSET_VERSION}/core/awards-2020-presidential.webp`,
    alt: "With the framed presidential certificate and medal",
    year: "2020 · Presidential Volunteer Service Award",
    title: "With the framed presidential certificate and medal",
    position: "50% 40%",
  },
  {
    frontSrc: `/${ASSET_VERSION}/core/awards-2020-each-moment-1.webp`,
    backSrc: `/${ASSET_VERSION}/core/awards-2020-each-moment-2.webp`,
    alt: "Quynh Chau Stone at the Each Moment Matters Award",
    year: "2020 · Each Moment Matters Award",
    title: "Recognized with the Each Moment Matters Award",
    backTitle: "Celebrating the Each Moment Matters Award",
    position: "42% 20%",
    backPosition: "62% 40%",
    flip: true,
  },
  {
    src: `/${ASSET_VERSION}/core/awards-2019-spirit.webp`,
    alt: "Spirit Award - for community spirit and volunteer leadership",
    year: "2019 · Junior League of Collin County",
    title: "Spirit Award - for community spirit and volunteer leadership",
    position: "50% 24%",
  },
  {
    frontSrc: `/${ASSET_VERSION}/core/awards-2018-groundbreaker-1.webp`,
    backSrc: `/${ASSET_VERSION}/core/awards-2018-groundbreaker-2.webp`,
    alt: "Accepting the Against The Grain Groundbreaker Award on stage",
    year: "2018 · Against The Grain",
    title: "Groundbreaker Award - accepting on stage",
    backYear: "2018 · Groundbreaker Award",
    backTitle: "Presented alongside fellow honorees",
    position: "50% 20%",
    backPosition: "50% 30%",
    flip: true,
  },
  {
    src: `/${ASSET_VERSION}/core/awards-2018-migrant-women.webp`,
    alt: "Celebrating the book's release",
    year: "2018 · 50 Inspiring Voices of Migrant Women",
    title: "Celebrating the book's release",
    position: "50% 22%",
  },
  {
    frontSrc: `/${ASSET_VERSION}/core/awards-2018-inspirique-1.webp`,
    backSrc: `/${ASSET_VERSION}/core/awards-2018-inspirique-2.webp`,
    alt: "Quynh Chau Stone at the Inspirique Circle of Light Awards red carpet",
    year: "2018 · Inspirique Circle of Light",
    title: "Honored in Beverly Hills, California",
    backYear: "2018 · Inspirique Circle of Light",
    backTitle: "For her dedication to philanthropy and community service",
    position: "50% 20%",
    backPosition: "center",
    flip: true,
    containBack: true,
  },
  {
    frontSrc: `/${ASSET_VERSION}/core/awards-2017-beyond-boundaries-1.webp`,
    backSrc: `/${ASSET_VERSION}/core/awards-2017-beyond-boundaries-2.webp`,
    alt: "Beyond Boundaries Award at GDAACC Annual Awards 2017 with Governor Greg Abbott",
    year: "2017 · GDAACC Annual Awards",
    title: "Beyond Boundaries Award - presented alongside Governor Greg Abbott",
    backTitle: "With Governor Greg Abbott and the State of Texas recognition",
    backYear: "2017 · Beyond Boundaries",
    position: "50% 42%",
    backPosition: "50% 2%",
    flip: true,
  },
  {
    src: `/${ASSET_VERSION}/core/awards-2016-women-that-soar.webp`,
    alt: "Accepting the Community Outreach Award on stage",
    year: "2016 · Women That Soar",
    title: "Accepting the Community Outreach Award on stage",
    position: "50% 38%",
  },
  {
    src: `/${ASSET_VERSION}/core/awards-2014-community-leadership.webp`,
    alt: "2014 TCAACC Annual Banquet - Community Leadership Award",
    year: "2014 · Community Leadership Award",
    title: "Tarrant County Asian American Chamber of Commerce Annual Banquet",
    position: "50% 40%",
  },
];

export default function AwardsPage() {
  return (
    <>
      <PageHeader
        src={`/${ASSET_VERSION}/core/awards-humanitarian-stage-light.webp`}
        title="AWARDS & RECOGNITION"
        subtitle="A LEGACY OF LEADERSHIP AND SERVICE"
      />
      <IntroductionSection />
      <HighlightedHonorsSection />
      <TimelineSection />
      <GallerySection />
      <DetailsSection />
      <CallToActionSection
        icon={HeartIcon}
        title="CREATING LASTING HOPE TOGETHER"
        href="/members"
        buttonText="GET INVOLVED">
        Awards are an honor, but our greatest achievement is the impact we
        create together. Your support helps us continue to serve, empower, and
        transform lives.
      </CallToActionSection>
    </>
  );
}

function IntroductionSection() {
  return (
    <PageSection className="gap-10 pb-15 lg:grid-cols-[1.15fr_.85fr] items-center">
      <div className="grid gap-5">
        <SectionHeading
          eyebrow="A lifetime of impact"
          title={
            <>
              A Legacy of <HighlightedText>Leadership</HighlightedText>
            </>
          }
        />
        <div className="grid gap-5 text-neutral-600">
          <p>
            For more than a decade, The Source of Hope and our president,{" "}
            <Bold>Quynh Chau Stone</Bold>, have been recognized by national,
            state, and community organizations for leadership, innovation,
            diversity, and service.
          </p>
          <p>
            Every honor here represents the same thing: lives changed through
            hope, education, wellness, and community impact.
          </p>
        </div>
        <LinkButton className="w-fit" href="#timeline" text="SEE THE HONORS" />
      </div>

      <figure className="relative aspect-4/5 max-h-150 w-full rounded-2xl overflow-hidden shadow-md bg-primary-900">
        <Image
          src={`/${ASSET_VERSION}/core/awards-hero.webp`}
          alt="Quynh Chau Stone holding her 2020 Presidential Volunteer Service Award medal beside the framed certificate"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover object-center"
        />
        <figcaption className="absolute left-4 bottom-4 flex items-center gap-2 bg-primary-900/80 backdrop-blur-sm border border-neutral-50/15 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-50">
          <StarIcon className="w-4 h-4 text-accent-300" aria-hidden="true" />
          2020 Presidential Volunteer Service Award
        </figcaption>
      </figure>
    </PageSection>
  );
}

const highlightedHonors = [
  {
    year: "2020",
    title: "Presidential Volunteer Service Award",
    description:
      "The highest national recognition for volunteer service, awarded by the President of the United States.",
    icon: TrophyIcon,
  },
  {
    year: "2017",
    title: "Beyond Boundaries Award",
    description:
      "Recognized for promoting diversity and inclusion, and building stronger communities through collaborative outreach.",
    icon: GlobeAltIcon,
  },
  {
    year: "2017",
    title: "Audrey Kaplan Inspiring Women Award",
    description:
      "Awarded by the Southwest Jewish Congress and featured in The Dallas Morning News.",
    icon: ShieldCheckIcon,
  },
  {
    year: "2016",
    title: "Women That Soar Community Award",
    description:
      "Presented for exceptional community leadership, service, and a commitment to empowering individuals and families.",
    icon: HeartIcon,
  },
];

function HighlightedHonorsSection() {
  return (
    <PageSection className="bg-neutral-200 py-15">
      <SectionHeading
        eyebrow="Our highlighted honors"
        title="The recognitions we hold closest"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {highlightedHonors.map(({ year, title, description, icon: Icon }) => (
          <article
            key={`${year}-${title}`}
            className="grid content-start gap-3 bg-neutral-50 rounded-2xl shadow-sm p-5 border-t-4 border-accent-500">
            <Icon className="w-10 h-10 text-accent-500" aria-hidden="true" />
            <Heading>{year}</Heading>
            <h3 className="font-urbanist font-bold text-lg text-primary-800 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-neutral-600">{description}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

function TimelineSection() {
  return (
    <PageSection className="py-15">
      <div id="timeline" className="scroll-mt-24" />
      <SectionHeading
        eyebrow="Our recognition timeline"
        title="More than a decade of honors"
      />

      <ol className="relative grid gap-8 max-w-4xl border-l-2 border-neutral-300 ml-2 md:ml-24">
        {timelineItems.map((item) => (
          <li
            key={`${item.year}-${item.title}`}
            className="relative pl-6 md:pl-8">
            <span
              aria-hidden="true"
              className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-accent-500 ${
                item.major
                  ? "bg-accent-500 ring-4 ring-accent-200"
                  : "bg-neutral-50"
              }`}
            />
            <span className="md:absolute md:-left-24 md:w-16 md:text-right block font-urbanist font-semibold text-lg text-primary-800">
              {item.year}
            </span>
            <h3 className="font-bold text-primary-800 leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
            {item.tag && (
              <span className="inline-block mt-2 text-xs font-bold tracking-widest uppercase text-accent-700 bg-accent-50 rounded px-2 py-1">
                {item.tag}
              </span>
            )}
          </li>
        ))}
      </ol>

      <aside className="max-w-4xl flex flex-col sm:flex-row gap-5 items-start bg-primary-800 text-neutral-300 rounded-2xl p-5 md:p-8 shadow-md">
        <UserGroupIcon
          className="w-10 h-10 shrink-0 text-accent-300"
          aria-hidden="true"
        />
        <p className="text-sm md:text-md">
          Quynh Chau Stone was also nominated to serve on an exclusive{" "}
          <strong className="text-neutral-50">City of Dallas board</strong> to
          develop the Asian American Cultural Center of Dallas - endorsed by
          Mayor Mike Rawlings and Deputy Mayor Pro-Tem Monica Alonzo.
        </p>
      </aside>
    </PageSection>
  );
}

function GallerySection() {
  return (
    <PageSection className="bg-neutral-200 py-15">
      <SectionHeading eyebrow="In the spotlight" title="Moments of recognition" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {galleryItems.map((item) => (
          <AwardsGalleryCard key={item.title} item={item} />
        ))}
      </div>
    </PageSection>
  );
}

function DetailsSection() {
  return (
    <PageSection className="py-15">
      <SectionHeading eyebrow="Beyond the awards" title="Press & government recognition" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DetailCard heading="Featured in press & media">
          <DetailItem
            icon={AcademicCapIcon}
            title="50 Inspiring Voices of Migrant Women"
            text="Featured contributor highlighting the journey from struggle to success."
          />
          <DetailItem
            icon={StarIcon}
            title="Women That Soar Anniversary Special"
            text="Featured across television stations in 12 major states."
          />
          <DetailItem
            icon={NewspaperIcon}
            title="The Dallas Morning News"
            text="Featured for multiple community awards and leadership recognition."
          />
          <DetailItem
            icon={ArrowPathIcon}
            title="Viet Face TV"
            text="Featured for the Community Outreach Award."
          />
        </DetailCard>

        <DetailCard heading="Government recognitions">
          <DetailItem
            icon={TrophyIcon}
            title="2016 Texas State Proclamation"
            text="Presented by Governor Greg Abbott in recognition of three years of community service."
          />
          <DetailItem
            icon={BuildingOfficeIcon}
            title="City of Dallas Board Nomination"
            text="Nominated to help develop the Asian American Cultural Center of Dallas - endorsed by Mayor Mike Rawlings and Deputy Mayor Pro-Tem Monica Alonzo."
          />
        </DetailCard>
      </div>
    </PageSection>
  );
}

function DetailCard({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <article className="grid content-start gap-5 bg-neutral-50 rounded-2xl shadow-sm p-5 md:p-8">
      <Heading className="border-b-2 border-neutral-300 pb-2">{heading}</Heading>
      <ul className="grid gap-5">{children}</ul>
    </article>
  );
}

function DetailItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof StarIcon;
  title: string;
  text: string;
}) {
  return (
    <li className="flex gap-3 items-start">
      <span className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-accent-50 text-accent-500">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-sm font-bold text-primary-800">{title}</h3>
        <p className="text-sm text-neutral-600 mt-0.5">{text}</p>
      </div>
    </li>
  );
}
