import { LinkButton } from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import PageSection from "@/components/ui/PageSection";

const ASSET_VERSION = "v2";

export default function HomeServingSection() {
  return (
    <PageSection className="hidden md:flex relative py-20 px-5 lg:px-35 bg-neutral-100 gap-8">
      <div className="flex-1 h-96 overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${ASSET_VERSION}/core/TSOH-Service.webp`}
          alt="People cooking food at Serving Hope Event"
          className="w-full h-full object-cover brightness-75"
          loading="lazy"
        />
      </div>
      <div className="flex-1 flex flex-col gap-5 justify-center bg-neutral-50 rounded-lg p-8 shadow-lg">
        <div className="text-sm font-semibold text-accent-600 uppercase tracking-wide">
          Get Involved
        </div>
        <Title className="text-2xl md:text-3xl">
          Let&lsquo;s Explore Your Next Steps, Together
        </Title>
        <p className="text-neutral-700">
          Whether you want to volunteer, donate, or simply learn more about our
          mission, we&lsquo;d love to connect with you and explore how you can make a
          difference in our community.
        </p>
        <div className="flex gap-3 flex-col sm:flex-row pt-4">
          <LinkButton href="/volunteer">Volunteer</LinkButton>
          <LinkButton href="/give">Donate</LinkButton>
        </div>
      </div>
    </PageSection>
  );
}
