"use client";

import Image from "next/image";
import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveLink from "@/components/ui/expressive/ExpressiveLink";
import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Overlay from "../ui/Overlay";
import { ASSET_VERSION } from "@/lib/environment";

interface ResourceCardProps {
  title: string;
  caption: string;
  src: string;
  to: string;
}

function ResourceCard({ title, caption, src, to }: ResourceCardProps) {
  const [active, setActive] = useState(false);

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="relative min-h-50 md:hidden w-full h-full group overflow-hidden rounded-xl aspect-square">
        <HomeResourceCardInner src={src} caption={caption} title={title} />
      </button>
      <Link
        href={to}
        className="relative hidden md:block w-full h-full group overflow-hidden rounded-xl aspect-square">
        <HomeResourceCardInner src={src} caption={caption} title={title} />
      </Link>
      <Overlay active={active} setActive={setActive}>
        <div className="flex justify-between items-start gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-900">
                {title}
              </h2>{" "}
              <button
                onClick={() => setActive(false)}
                className="rounded-full p-2 hover:bg-neutral-200 transition-colors duration-750">
                <XMarkIcon className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              {caption}
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end w-fit">
          <ExpressiveLink
            ariaLabel={`Learn more about ${title} at the source of hope`}
            to={to}
            className="font-semibold text-accent-700 hover:text-accent-800 transition-colors duration-750">
            Learn about {title}
          </ExpressiveLink>
        </div>
      </Overlay>
    </>
  );
}

interface ResourceCardInnerProps {
  title: string;
  caption: string;
  src: string;
}

function HomeResourceCardInner({
  src,
  caption,
  title,
}: ResourceCardInnerProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={caption}
        fill
        onLoad={() => setLoaded(true)}
        onError={(e) => (e.currentTarget.src = "/core/placeholder.webp")}
        className={`${
          loaded ? "opacity-100" : "opacity-0"
        } inset-0 w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1] bg-accent-900`}
      />
      <div
        className="absolute bottom-0 left-0 w-full p-5 
                bg-linear-to-t from-black/90 to-transparent
                rounded-xl flex flex-col justify-start">
        <h2 className="md:line-clamp-1 text-md text-ellipsis lg:group-hover:text-sm duration-750 transition-all ease-in-out font-semibold text-center text-neutral-50">
          {title}
        </h2>
        <p
          className="text-sm hidden lg:block text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden
                  transition-[height_opacity] duration-750 text-left
                  group-hover:max-h-70 group-hover:opacity-100 ease-in-out text-balance">
          {caption}
        </p>
      </div>
      <div className="absolute right-5 top-5 p-1 rounded-full bg-black/70 h-fit w-fit text-neutral-50">
        <ArrowRightIcon
          className="w-[1em] h-[1em] transition-transform ease-in-out duration-750 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

export default function HomeResourcesSection() {
  return (
    <section
      className={`w-full gap-10 relative grid p-5 py-10 md:px-10 bg-neutral-50`}>
      <Title className="text-center text-balance text-2xl md:text-3xl">
        We provide a number of{" "}
        <ExpressiveLink inline={false} to="/serve">
          <Emphasis>resources</Emphasis>
        </ExpressiveLink>{" "}
        to our community.
      </Title>
      <div className="w-full grid grid-flow-row md:grid-cols-3 gap-5 md:gap-10">
        <ResourceCard
          title="Education For Hope"
          to=""
          caption="Education for Hope supports students of all ages through tutoring, scholarships, and workforce opportunities. We provide low-income cosmetology students with access to advanced training, partner with The University of Texas at Dallas through the Federal Work-Study program, and offer operational roles that build professional experience. By removing barriers to education, we empower individuals to learn, grow, and create brighter futures for themselves and their families."
          src={`/${ASSET_VERSION}/educationHope/EH-ResourceTile.webp`}
        />
        <ResourceCard
          title="Wellness of Hope Clinic"
          to=""
          caption="The Wellness of Hope Clinic offers holistic treatments such as fire cupping and lymphatic drainage to low-income individuals, seniors, teachers, and first responders. In partnership with Stone International Wellness Center, we also provide reduced cosmetic services and wellness classes. These therapies restore health, build confidence, and make lasting impacts for people who might otherwise be unable to access care."
          src={`/${ASSET_VERSION}/wellnessHope/WH-ResourceTile.webp`}
        />
        <ResourceCard
          title="Serving Hope"
          to=""
          caption="Serving Hope is a volunteer-driven initiative dedicated to providing organic, home-cooked meals to those in need across the Dallas–Fort Worth area. Through partnerships and community support, we nourish homeless individuals, veterans, nursing home residents, and at-risk families. Each event focuses on fresh food, dignity, and connection, ensuring both body and spirit are cared for while building stronger, more compassionate communities."
          src={`/${ASSET_VERSION}/servingHope/SH-ResourceTile.webp`}
        />
        <ResourceCard
          title="Sharing Hope"
          to=""
          caption="Sharing Hope transforms surplus food donations into community impact. Partnering with over 50 nonprofits, we distribute meals and essential supplies to families facing food insecurity across the region. This initiative reduces food waste, strengthens partnerships, and ensures that resources reach those who need them most, turning generosity into daily nourishment for thousands of lives."
          src={`/${ASSET_VERSION}/sharingHope/SH-ResourceTile.webp`}
        />
        <ResourceCard
          title="Hope For The Great Outdoors"
          to=""
          caption="Hope for the Great Outdoors introduces individuals and families to nature through hands-on learning and immersive outdoor experiences. From camping and fishing to survival skills, participants gain confidence while developing a lifelong respect for the environment. By making the outdoors accessible and inclusive, the program creates opportunities for growth, bonding, and wellness in a safe and supportive setting."
          src={`/${ASSET_VERSION}/outdoorHope/OH-ResourceTile.webp`}
        />
        <ResourceCard
          title="International Partner Serving"
          to=""
          caption="Our International Partner Serving program extends hope worldwide by collaborating with organizations and volunteers to deliver resources, training, and empowerment. We provide scholarships, educational tools, wellness services, and food support to underserved communities in developing regions. By fostering relationships based on trust and respect, we amplify dignity and self-sufficiency, ensuring that compassion knows no borders and hope reaches people across the globe."
          src={`/${ASSET_VERSION}/internationalHope/IH-ResourceTile.webp`}
        />
      </div>
    </section>
  );
}
