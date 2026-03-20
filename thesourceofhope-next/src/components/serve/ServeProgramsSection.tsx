'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { MapPinIcon } from '@heroicons/react/20/solid';
import ExpressiveAnchor from '@/components/ui/ExpressiveAnchor';
import Title from '@/components/ui/Title';
import Heading from '@/components/ui/Heading';

const ASSET_VERSION = 'v2';

interface ServingArticleProps {
  src?: string;
  title: string;
  caption: string;
  children: ReactNode;
  side?: boolean;
}

export default function ServeProgramsSection() {
  const left = true;
  const right = false;

  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleScroll = () => {
      const rectangle = element.getBoundingClientRect();
      const height = window.innerHeight;
      const visible = 1 - Math.min(Math.max(rectangle.top / height, 0), 1);
      setProgress(visible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 1 - progress;

  return (
    <>
      <section className="relative w-full pt-5 grid gap-5 bg-neutral-200 text-sm md:text-md">
        <div className="grid gap-1 justify-self-start justify-start lg:px-35 px-5">
          <Title className="text-xlg md:text-xxlg text-balance font-urbanist">
            Make an Impact Today
          </Title>
          <Heading className="text-sm md:text-md text-accent-700 font-semibold">
            VOLUNTEER FOR ONE OF OUR PROGRAMS
          </Heading>
        </div>
        <article
          ref={ref}
          className="[--base-padding:0px] lg:[--base-padding:80px]"
          style={{
            paddingLeft: `calc(${scale} * var(--base-padding))`,
            paddingRight: `calc(${scale} * var(--base-padding))`,
            transition: 'padding 0.15s linear',
            willChange: 'padding',
          }}
        >
          <ServingArticle
            src={`/${ASSET_VERSION}/serve/SH-Banner2.webp`}
            title="SERVING HOPE"
            caption="Every meal served. Every smile shared. Together."
            side={left}
          >
            <div className="flex items-center gap-3 w-fit px-3 py-1 rounded-full text-neutral-600 border">
              <MapPinIcon className="w-[16px] h-[16px]" />
              <p className="text-sm">2627 South Ervay Dallas, TX</p>
            </div>
            <p className="text-balance text-sm md:text-md">
              Every fourth Friday and Saturday, our volunteers gather to cook,
              package, and serve hot home-cooked meals to those experiencing
              homelessness, seniors, and students in need. Serving Hope also
              provides free haircuts, showers, clothing, and meals to first
              responders, underprivileged families, and emerging professionals.
              It&apos;s more than food—we serve dignity, compassion, and connection.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveAnchor
                className="text-sm md:text-md text-accent-500"
                href="/serving-hope"
              >
                Volunteer at Our Next Event
              </ExpressiveAnchor>
            </button>
          </ServingArticle>
          <ServingArticle
            src={`/${ASSET_VERSION}/serve/EH-Banner.webp`}
            title="EDUCATION FOR HOPE"
            caption="Empowering through mentorship."
            side={right}
          >
            <p className="text-balance text-sm md:text-md">
              Through our ILA Tutoring Program, we empower students with
              individualized mentorship in reading and writing. Tutors work
              one-on-one to inspire confidence, critical thinking, and a
              lifelong love of learning. By helping students reach academic
              goals, we build stronger foundations for brighter futures.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveAnchor
                className="text-sm md:text-md text-accent-500"
                href="/education-hope"
              >
                Become a Tutor
              </ExpressiveAnchor>
            </button>
          </ServingArticle>
          <ServingArticle
            src={`/${ASSET_VERSION}/serve/WH-Banner.webp`}
            title="WELLNESS OF HOPE"
            caption="Healing body and spirit."
            side={left}
          >
            <div className="flex items-center gap-3 w-fit px-3 py-1 rounded-full text-neutral-600 border">
              <MapPinIcon className="w-[1em] h-[1em]" />
              <p className="text-sm">1108 W Parker Rd Plano, TX</p>
            </div>
            <p className="text-balance text-sm md:text-md">
              In partnership with Stone International Wellness Center, the
              Wellness of Hope program offers free or reduced holistic
              treatments—such as fire cupping, lymphatic drainage, and ear
              detox—to low-income families, first responders, teachers, and
              seniors. We believe that when the body is healed, the spirit
              follows—because wellness is hope in action.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveAnchor
                className="text-sm md:text-md text-accent-500"
                href="/wellness-hope"
              >
                Support Community Wellness
              </ExpressiveAnchor>
            </button>
          </ServingArticle>
          <ServingArticle
            src={`/${ASSET_VERSION}/serve/SH-Banner2.webp`}
            title="SHARING HOPE"
            caption="Extending love beyond borders."
            side={right}
          >
            <div className="flex items-center gap-3 w-fit px-3 py-1 rounded-full text-neutral-600 border">
              <MapPinIcon className="w-[16px] h-[16px]" />
              <p className="text-sm">2627 South Ervay Dallas, TX</p>
            </div>
            <p className="text-balance text-sm md:text-md">
              Sharing Hope focuses on distributing meals, hygiene kits, and
              resources to other nonprofits, shelters, and community
              organizations across North Texas. By partnering with local
              missions and outreach centers, we multiply our impact—ensuring
              every donated meal reaches the hands of those who need it most.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveAnchor
                className="text-sm md:text-md text-accent-500"
                href="/sharing-hope"
              >
                Partner with Us
              </ExpressiveAnchor>
            </button>
          </ServingArticle>
          <ServingArticle
            src={`/${ASSET_VERSION}/serve/OH-Banner.webp`}
            title="HOPE FOR THE GREAT OUTDOORS"
            caption="Connecting people to nature and purpose."
            side={left}
          >
            <p className="text-balance text-sm md:text-md">
              Led by founder Wesley Stone, a retired wildlife biologist, this
              program teaches outdoor education, camping, fishing, hunting, and
              survival skills with an emphasis on safety, stewardship, and
              self-reliance. Hope for the Great Outdoors reconnects people with
              nature and encourages responsibility, teamwork, and resilience
              through annual community camping trips and hands-on training.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveAnchor
                className="text-sm md:text-md text-accent-500"
                href="/outdoor-hope"
              >
                Join the Next Outdoor Experience
              </ExpressiveAnchor>
            </button>
          </ServingArticle>
          <ServingArticle
            src={`/${ASSET_VERSION}/serve/IH-Banner.webp`}
            title="INTERNATIONAL PARTNER SERVING"
            caption="Global compassion in action."
            side={right}
          >
            <p className="text-balance text-sm md:text-md">
              The Source of Hope extends its mission worldwide through
              international partnerships providing food, educational supplies,
              and wellness aid to communities in Southeast Asia and beyond. By
              collaborating with local leaders and volunteers, we bring
              sustainable resources and hope to those facing poverty, disaster,
              and hardship—proving that kindness knows no borders.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveAnchor
                className="text-sm md:text-md text-accent-500"
                href="/international-hope"
              >
                Learn About Global Outreach
              </ExpressiveAnchor>
            </button>
          </ServingArticle>
        </article>
      </section>
    </>
  );
}

function ServingArticle({
  src = `/${ASSET_VERSION}/core/TSOH-Service.webp`,
  title,
  caption,
  children,
  side = false,
}: ServingArticleProps) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rectangle = element.getBoundingClientRect();
      const height = window.innerHeight;
      const visible = Math.min(Math.max(rectangle.top / height, 0), 1);
      setProgress(visible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const brightness = 1 - progress * 0.35;

  return (
    <article
      ref={ref}
      className="lg:sticky top-0 lg:h-screen w-full overflow-hidden [--base-brightness:0] lg:[--base-brightness:1]"
      style={{
        filter: `brightness(calc(${brightness} * var(--base-padding)))`,
      } as React.CSSProperties}
    >
      <img
        className="hidden lg:block lg:absolute inset-0 h-full w-full object-cover brightness-[.8] contrast-[1.1] rounded-t-4xl"
        src={src}
        alt={caption}
      />
      <ServingLayer title={title} caption={caption} side={side}>
        {children}
      </ServingLayer>
    </article>
  );
}

function ServingCard({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="lg:w-1/3 flex flex-col gap-3 rounded-2xl shadow-2x overflow-hidden h-fit py-5 px-10 bg-neutral-50 text-neutral-950">
      <Heading>{title}</Heading>
      <p className="text-lg font-urbanist font-semibold text-balance">{caption}</p>
      {children}
    </div>
  );
}

function ServingLayer({
  title,
  caption,
  children,
  side = false,
}: {
  title: string;
  caption: string;
  children: ReactNode;
  side?: boolean;
}) {
  return (
    <div
      className={`lg:absolute lg:left-1/2 lg:-translate-x-1/2 inset-y-0 lg:w-screen w-full grid items-center justify-items-center p-5 lg:px-25 z-10 ${
        side ? 'lg:justify-items-start' : 'justify-items-end'
      }`}
    >
      <ServingCard title={title} caption={caption}>
        {children}
      </ServingCard>
    </div>
  );
}
