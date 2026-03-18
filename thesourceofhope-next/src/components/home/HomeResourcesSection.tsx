import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import PageSection from "@/components/ui/PageSection";

const ASSET_VERSION = "v2";

interface ResourceCardProps {
  title: string;
  href: string;
  description: string;
  image: string;
}

function HomeResourceCard({ title, href, description, image }: ResourceCardProps) {
  return (
    <div className="group flex flex-col gap-4 rounded-lg overflow-hidden bg-neutral-100 hover:shadow-lg transition">
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-urbanist font-bold text-lg text-neutral-900">
          {title}
        </h3>
        <p className="text-sm text-neutral-700 line-clamp-3">{description}</p>
        <ExpressiveLink to={href} className="text-sm">
          Learn More
        </ExpressiveLink>
      </div>
    </div>
  );
}

export default function HomeResourcesSection() {
  return (
    <PageSection className="w-full md:mb-15 p-5 md:py-10 lg:px-15">
      <Title className="mb-10 text-center text-balance text-2xl md:text-3xl">
        We provide a number of{" "}
        <ExpressiveLink to="/serve">
          <Emphasis>resources</Emphasis>
        </ExpressiveLink>{" "}
        to our community.
      </Title>
      <div className="w-full grid grid-flow-row md:grid-cols-3 gap-5 md:gap-10">
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
    </PageSection>
  );
}
