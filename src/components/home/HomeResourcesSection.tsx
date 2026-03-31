import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const ASSET_VERSION = "v2";

interface ResourceCardProps {
  title: string;
  href: string;
  description: string;
  image: string;
}

function HomeResourceCard({
  title,
  href,
  description,
  image,
}: ResourceCardProps) {
  return (
    <Link
      href={href}
      className="no-underline! group relative flex flex-col gap-4 rounded-lg overflow-hidden bg-neutral-100 hover:shadow-sm transition duration-700">
      <div className="relative h-80 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-urbanist font-bold text-lg text-neutral-900">
          {title}
        </h3>
        <p className="text-sm text-neutral-700 line-clamp-3">{description}</p>
      </div>
      <div className="absolute right-5 top-5 p-1 rounded-full bg-black/70 h-fit w-fit text-neutral-50">
        <ArrowRightIcon
          className="w-[1em] h-[1em] transition-transform ease-in-out duration-750 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export default function HomeResourcesSection() {
  return (
    <section className="grid gap-8 py-5 px-5 md:px-15 w-full md:mb-15 p-5 md:py-10">
      <Title className="text-center text-balance text-2xl md:text-3xl">
        We provide a number of{" "}
        <ExpressiveLink disableArrow to="/serve">
          <Emphasis className="no-underline!">resources</Emphasis>
        </ExpressiveLink>{" "}
        to our community.
      </Title>
      <div className="w-full grid grid-flow-row md:grid-cols-3 gap-10">
        <HomeResourceCard
          title="Education For Hope"
          href="/serve/educationHope"
          description="Education for Hope supports students of all ages through tutoring, scholarships, and workforce opportunities."
          image={`/${ASSET_VERSION}/educationHope/EH-ResourceTile.webp`}
        />
        <HomeResourceCard
          title="Wellness of Hope Clinic"
          href="/serve/wellnessHope"
          description="The Wellness of Hope Clinic offers holistic treatments such as fire cupping and lymphatic drainage to low-income individuals."
          image={`/${ASSET_VERSION}/wellnessHope/WH-ResourceTile.webp`}
        />
        <HomeResourceCard
          title="Serving Hope"
          href="/serve/servingHope"
          description="Serving Hope is a volunteer-driven initiative dedicated to providing organic, home-cooked meals to those in need."
          image={`/${ASSET_VERSION}/servingHope/SH-ResourceTile.webp`}
        />
        <HomeResourceCard
          title="Sharing Hope"
          href="/serve/sharingHope"
          description="Sharing Hope transforms surplus food donations into community impact through partnerships with over 50 nonprofits."
          image={`/${ASSET_VERSION}/sharingHope/SH-ResourceTile.webp`}
        />
        <HomeResourceCard
          title="Hope For The Great Outdoors"
          href="/serve/outdoorHope"
          description="Outdoor Hope brings nature and wellness together through community events and outdoor activities."
          image={`/${ASSET_VERSION}/outdoorHope/OH-ResourceTile.webp`}
        />
        <HomeResourceCard
          title="International Hope"
          href="/serve/internationalHope"
          description="International Hope extends our mission globally through partnerships and humanitarian support."
          image={`/${ASSET_VERSION}/internationalHope/IH-ResourceTile.webp`}
        />
      </div>
    </section>
  );
}
