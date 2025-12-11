import { BanknotesIcon } from "@heroicons/react/20/solid";
import Title from "../../../components/ui/text/Title";
import { AnchorButton } from "../../../components/ui/Button";

export default function ServeDonationSection() {
  return (
    <section className="py-10 px-5 lg:px-35 w-full grid gap-15 items-center justify-items-center bg-accent-800 text-neutral-50">
      <article className="md:w-1/2 grid gap-5 justify-items-center text-balance text-center">
        <BanknotesIcon className="w-[80px] h-[80px]" />
        <Title className="text-lg md:text-xlg font-urbanist font-semibold">
          INVEST IN HOLISTIC WELLNESS
        </Title>
        <p className="text-sm md:text-md lg:text-lg text-neutral-300">
          Your generosity helps us bless the communities surrounding The Source
          of Hope with love, support, and transformation.
        </p>
        <div className="w-fit">
          <AnchorButton className="w-fit" text="DONATE" />
        </div>
      </article>
    </section>
  );
}
