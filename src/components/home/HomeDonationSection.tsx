import { AnchorButton } from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import PageSection from "@/components/ui/PageSection";
import { BanknotesIcon } from "@heroicons/react/20/solid";

export default function HomeDonationSection() {
  return (
    <PageSection className="py-10 min-h-100 px-5 lg:px-35 w-full h-full grid gap-15 items-center justify-items-center bg-accent-800 text-neutral-50">
      <article className="md:w-1/2 grid gap-5 justify-items-center text-balance text-center">
        <BanknotesIcon className="w-20 h-20 text-neutral-50" />
        <Title className="text-2xl md:text-3xl text-neutral-50">
          INVEST IN HOLISTIC WELLNESS
        </Title>
        <p className="text-sm md:text-md lg:text-lg text-neutral-300">
          Your generosity helps us bless the communities surrounding The Source
          of Hope with love, support, and transformation.
        </p>
        <div className="w-fit pt-4">
          <AnchorButton 
            href="https://donate.stripe.com/8wM5kHal16fC4so8ww"
            text="DONATE NOW"
          />
        </div>
      </article>
    </PageSection>
  );
}
