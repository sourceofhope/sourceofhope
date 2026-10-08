import Image from "next/image";
import { Metadata } from "next";
import type { ReactNode } from "react";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import Bold from "@/components/ui/Bold";
import Blockquote from "@/components/ui/Blockquote";
import HighlightedText from "@/components/ui/HighlightedText";
import { LinkButton } from "@/components/ui/Button";
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

const ASSETS = `/${ASSET_VERSION}/core`;

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  tag?: string;
  major?: boolean;
}

const timelineItems: TimelineItem[] = [
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

type BaseGalleryItem = {
  alt: string;
  year: string;
  title: string;
  position: string;
};

type SingleGalleryItem = BaseGalleryItem & {
  src: string;
  flip?: false;
};

type FlipGalleryItem = BaseGalleryItem & {
  frontSrc: string;
  backSrc: string;
  backTitle?: string;
  backYear?: string;
  backPosition?: string;
  containBack?: boolean;
  flip: true;
};

type GalleryItem = SingleGalleryItem | FlipGalleryItem;

const galleryItems: GalleryItem[] = [
  {
    src: `${ASSETS}/awards-2024-uplifted.webp`,
    alt: "Recognized among Asian American community leaders",
    year: "2024 · Uplifted Conference",
    title: "Recognized among Asian American community leaders",
    position: "50% 24%",
  },
  {
    src: `${ASSETS}/awards-2021-humanitarian.webp`,
    alt: "“You Can Live Again” - honored for humanitarian service",
    year: "2021 · Humanitarian Award",
    title: "“You Can Live Again” - honored for humanitarian service",
    position: "68% 42%",
  },
  {
    src: `${ASSETS}/awards-2020-presidential.webp`,
    alt: "With the framed presidential certificate and medal",
    year: "2020 · Presidential Volunteer Service Award",
    title: "With the framed presidential certificate and medal",
    position: "50% 40%",
  },
  {
    frontSrc: `${ASSETS}/awards-2020-each-moment-1.webp`,
    backSrc: `${ASSETS}/awards-2020-each-moment-2.webp`,
    alt: "Quynh Chau Stone at the Each Moment Matters Award",
    year: "2020 · Each Moment Matters Award",
    title: "Recognized with the Each Moment Matters Award",
    backTitle: "Celebrating the Each Moment Matters Award",
    position: "42% 20%",
    backPosition: "62% 40%",
    flip: true,
  },
  {
    src: `${ASSETS}/awards-2019-spirit.webp`,
    alt: "Spirit Award - for community spirit and volunteer leadership",
    year: "2019 · Junior League of Collin County",
    title: "Spirit Award - for community spirit and volunteer leadership",
    position: "50% 24%",
  },
  {
    frontSrc: `${ASSETS}/awards-2018-groundbreaker-1.webp`,
    backSrc: `${ASSETS}/awards-2018-groundbreaker-2.webp`,
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
    src: `${ASSETS}/awards-2018-migrant-women.webp`,
    alt: "Celebrating the book's release",
    year: "2018 · 50 Inspiring Voices of Migrant Women",
    title: "Celebrating the book's release",
    position: "50% 22%",
  },
  {
    frontSrc: `${ASSETS}/awards-2018-inspirique-1.webp`,
    backSrc: `${ASSETS}/awards-2018-inspirique-2.webp`,
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
    frontSrc: `${ASSETS}/awards-2017-beyond-boundaries-1.webp`,
    backSrc: `${ASSETS}/awards-2017-beyond-boundaries-2.webp`,
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
    src: `${ASSETS}/awards-2016-women-that-soar.webp`,
    alt: "Accepting the Community Outreach Award on stage",
    year: "2016 · Women That Soar",
    title: "Accepting the Community Outreach Award on stage",
    position: "50% 38%",
  },
  {
    src: `${ASSETS}/awards-2014-community-leadership.webp`,
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
        src={`${ASSETS}/awards-humanitarian-stage-light.webp`}
        title="AWARDS & RECOGNITION"
        subtitle="A LEGACY OF LEADERSHIP"
      />
      <AwardsIntroSection />
      <HighlightedHonors />
      <RecognitionTimeline />
      <RecognitionGallery />
      <RecognitionDetails />
      <CallToAction />
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <div className="grid gap-1 justify-self-start">
      <Heading>{eyebrow}</Heading>
      <Title className="text-balance">{title}</Title>
    </div>
  );
}

function AwardsIntroSection() {
  return (
    <PageSection className="md:grid-cols-[1.2fr_.8fr] items-center text-sm md:text-md lg:text-lg">
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
          <Blockquote className="max-w-[60ch]">
            A lifetime of impact - earned one community at a time.
          </Blockquote>
          <p>
            Every honor here represents the same thing: lives changed through
            hope, education, wellness, and community impact.
          </p>
        </div>
        <LinkButton href="#timeline" text="SEE THE HONORS" className="w-fit" />
      </div>

      <figure className="relative aspect-4/5 w-full max-w-md justify-self-center md:justify-self-end rounded-2xl overflow-hidden shadow-sm bg-primary-900">
        <Image
          src={`${ASSETS}/awards-hero.webp`}
          alt="Quynh Chau Stone holding her 2020 Presidential Volunteer Service Award medal beside the framed certificate"
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover object-center"
        />
        <figcaption className="absolute left-3 bottom-3 flex items-center gap-2 rounded-xl bg-primary-900/80 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-neutral-50">
          <StarIcon className="size-4 text-accent-300" aria-hidden="true" />
          2020 Presidential Volunteer Service Award
        </figcaption>
      </figure>
    </PageSection>
  );
}

function HighlightedHonors() {
  const honors = [
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
      year: "2016",
      title: "Women That Soar Community Award",
      description:
        "Presented for exceptional community leadership, service, and a commitment to empowering individuals and families.",
      icon: HeartIcon,
    },
    {
      year: "2017",
      title: "Audrey Kaplan Inspiring Women Award",
      description:
        "Awarded by the Southwest Jewish Congress and featured in The Dallas Morning News.",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <PageSection id="honors" className="bg-neutral-200 py-10 gap-5">
      <SectionHeading
        eyebrow="Highlighted honors"
        title="The recognitions we hold closest"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {honors.map(({ year, title, description, icon: HonorIcon }) => (
          <article
            key={`${year}-${title}`}
            className="grid content-start gap-3 rounded-2xl bg-neutral-100 p-5 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-50 text-accent-500">
              <HonorIcon className="size-6" aria-hidden="true" />
            </span>
            <p className="text-xs font-bold tracking-widest text-neutral-500">
              {year}
            </p>
            <Heading className="leading-tight">{title}</Heading>
            <p className="text-sm text-neutral-600">{description}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

// Group consecutive entries that share a year so each year is shown once.
function groupByYear(items: TimelineItem[]) {
  return items.reduce<{ year: string; items: TimelineItem[] }[]>(
    (groups, item) => {
      const last = groups[groups.length - 1];
      if (last?.year === item.year) last.items.push(item);
      else groups.push({ year: item.year, items: [item] });
      return groups;
    },
    [],
  );
}

function RecognitionTimeline() {
  return (
    <PageSection id="timeline" className="py-10 gap-5">
      <SectionHeading
        eyebrow="Recognition timeline"
        title="More than a decade of honors"
      />

      <ol className="grid max-w-4xl">
        {groupByYear(timelineItems).map((group) => (
          <li
            key={group.year}
            className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_1fr] gap-3 md:gap-5 [&:last-child>ul]:pb-0">
            <p className="font-urbanist font-semibold text-lg md:text-xlg text-primary-700 text-right leading-tight">
              {group.year}
            </p>
            <ul className="grid gap-5 border-l-2 border-neutral-300 pl-5 pb-8">
              {group.items.map((item) => (
                <li key={item.title} className="relative grid gap-1">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[1.6875rem] top-1.5 size-3 rounded-full border-2 border-accent-500 ${
                      item.major
                        ? "bg-accent-500 ring-4 ring-accent-200"
                        : "bg-neutral-50"
                    }`}
                  />
                  <h3 className="font-semibold text-primary-800 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                  {item.tag && (
                    <span className="w-fit rounded-md bg-accent-50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-accent-700">
                      {item.tag}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <aside className="flex max-w-4xl flex-col sm:flex-row items-start gap-5 rounded-2xl bg-accent-800 p-5 md:p-8 text-neutral-50 shadow-sm">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50/10 text-accent-200">
          <UserGroupIcon className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm md:text-md text-neutral-300">
          Quynh Chau Stone was also nominated to serve on an exclusive{" "}
          <strong className="text-neutral-50">City of Dallas board</strong> to
          develop the Asian American Cultural Center of Dallas - endorsed by
          Mayor Mike Rawlings and Deputy Mayor Pro-Tem Monica Alonzo.
        </p>
      </aside>
    </PageSection>
  );
}

function RecognitionGallery() {
  return (
    <PageSection id="moments" className="bg-neutral-200 py-10 gap-5">
      <SectionHeading eyebrow="In the spotlight" title="Moments of recognition" />
      <div className="grid gap-5 md:grid-cols-2">
        {galleryItems.map((item) =>
          item.flip ? (
            <FlipGalleryCard key={item.title} item={item} />
          ) : (
            <GalleryCard key={item.title} item={item} />
          ),
        )}
      </div>
    </PageSection>
  );
}

function GalleryCaption({ year, title }: { year: string; title: string }) {
  return (
    <figcaption className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-linear-to-t from-primary-900/90 via-primary-900/30 to-transparent text-neutral-50">
      <p className="text-xs font-bold uppercase tracking-widest text-accent-200">
        {year}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug">{title}</p>
    </figcaption>
  );
}

const galleryFrame = "rounded-2xl overflow-hidden shadow-sm bg-primary-900";

function GalleryCard({ item }: { item: SingleGalleryItem }) {
  return (
    <figure className={`relative aspect-4/3 ${galleryFrame}`}>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none"
        style={{ objectPosition: item.position }}
      />
      <GalleryCaption year={item.year} title={item.title} />
    </figure>
  );
}

// Flips on hover, and on focus so it also works for keyboard and touch users.
function FlipGalleryCard({ item }: { item: FlipGalleryItem }) {
  return (
    <div
      tabIndex={0}
      aria-label={`${item.title} - two photos, focus to flip`}
      className="group relative aspect-4/3 perspective-[1200px] rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-400">
      <div className="absolute inset-0 transition-transform duration-700 transform-3d motion-reduce:transition-none group-hover:rotate-y-180 group-focus:rotate-y-180">
        <figure className={`absolute inset-0 backface-hidden ${galleryFrame}`}>
          <Image
            src={item.frontSrc}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: item.position }}
          />
          <span className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-primary-900/70 backdrop-blur-sm px-2.5 py-1.5 text-xs font-semibold text-neutral-50">
            <ArrowPathIcon className="size-3.5" aria-hidden="true" />
            Tap or hover to flip · 2 photos
          </span>
          <GalleryCaption year={item.year} title={item.title} />
        </figure>

        <figure
          className={`absolute inset-0 backface-hidden rotate-y-180 ${galleryFrame}`}>
          <Image
            src={item.backSrc}
            alt={item.backTitle ?? item.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={item.containBack ? "object-contain" : "object-cover"}
            style={{ objectPosition: item.backPosition }}
          />
          <GalleryCaption
            year={item.backYear ?? item.year}
            title={item.backTitle ?? item.title}
          />
        </figure>
      </div>
    </div>
  );
}

function DetailCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="grid content-start gap-5 rounded-2xl bg-neutral-100 p-5 md:p-8 shadow-sm">
      <Heading className="border-b-2 border-neutral-300 pb-2">{label}</Heading>
      {children}
    </article>
  );
}

function RecognitionDetails() {
  return (
    <PageSection className="py-10 lg:grid-cols-3 gap-5">
      <DetailCard label="Featured in press & media">
        <ul className="grid gap-5">
          <DetailItem
            icon={<AcademicCapIcon className="size-5" />}
            title="50 Inspiring Voices of Migrant Women"
            text="Featured contributor highlighting the journey from struggle to success."
          />
          <DetailItem
            icon={<StarIcon className="size-5" />}
            title="Women That Soar Anniversary Special"
            text="Featured across television stations in 12 major states."
          />
          <DetailItem
            icon={<NewspaperIcon className="size-5" />}
            title="The Dallas Morning News"
            text="Featured for multiple community awards and leadership recognition."
          />
          <DetailItem
            icon={<ArrowPathIcon className="size-5" />}
            title="Viet Face TV"
            text="Featured for the Community Outreach Award."
          />
        </ul>
      </DetailCard>

      <DetailCard label="Government recognitions">
        <ul className="grid gap-5">
          <DetailItem
            icon={<TrophyIcon className="size-5" />}
            title="2016 Texas State Proclamation"
            text="Presented by Governor Greg Abbott in recognition of three years of community service."
          />
          <DetailItem
            icon={<BuildingOfficeIcon className="size-5" />}
            title="City of Dallas Board Nomination"
            text="Nominated to help develop the Asian American Cultural Center of Dallas - endorsed by Mayor Mike Rawlings and Deputy Mayor Pro-Tem Monica Alonzo."
          />
        </ul>
      </DetailCard>

      <DetailCard label="Our heart, our honor">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-500">
          <HeartIcon className="size-7" aria-hidden="true" />
        </span>
        <p className="text-sm md:text-md text-neutral-600">
          Awards are an honor - but our greatest achievement is the impact we
          create together. Every volunteer, donor, partner, and supporter plays
          a vital role in bringing hope, healing, and opportunity to our
          community.
        </p>
        <p className="font-urbanist text-lg font-semibold text-accent-600">
          Thank you for being part of our mission.
        </p>
      </DetailCard>
    </PageSection>
  );
}

function DetailItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-500">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-primary-800">{title}</h3>
        <p className="mt-0.5 text-sm text-neutral-600">{text}</p>
      </div>
    </li>
  );
}

function CallToAction() {
  return (
    <section className="w-full grid justify-items-center bg-accent-800 px-5 py-10 lg:px-35 text-neutral-50">
      <article className="md:w-1/2 grid gap-5 justify-items-center text-balance text-center">
        <HeartIcon className="size-20" aria-hidden="true" />
        <Title className="text-neutral-50">
          Together, we are creating lasting hope - one community at a time.
        </Title>
        <p className="text-sm md:text-md lg:text-lg text-neutral-300">
          Your support helps us continue to serve, empower, and transform lives.
        </p>
        <LinkButton href="/members" text="GET INVOLVED" className="w-fit" />
      </article>
    </section>
  );
}
