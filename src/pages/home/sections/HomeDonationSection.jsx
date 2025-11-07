import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import { ServingCard } from "./HomeServingSection";
import { HomeContent } from "../HomePage";
import Title from "../../../components/ui/text/Title";

export default function HomeDonationSection() {
  return (
    <HomeContent className="py-10 min-h-100 px-5 lg:px-35 w-full h-full grid gap-15 items-center justify-items-center bg-accent-800 text-neutral-50">
      <ServingCard className="md:hidden w-full max-w-105 bg-neutral-100" />
      <article className="md:w-1/2 grid gap-5 justify-items-center text-balance text-center">
        <BanknotesIcon className="w-[80px] h-[80px]" />
        <Title>INVEST IN HOLISTIC WELLNESS</Title>
        <p className="text-sm md:text-md lg:text-lg text-neutral-300">
          Your generosity helps us bless the communities surrounding The Source
          of Hope with love, support, and transformation.
        </p>
        <button className="border-5 rounded-2xl font-bold w-fit shadow-sm hover:shadow-lg shadow-accent-500/70 bg-accent-500 border-accent-500 text-neutral-50/75 duration-500 hover:text-neutral-50/95 opacity-85 hover:opacity-100 transition-[shadow_colors]">
          <ExpressiveLink className="px-10 py-5">DONATE</ExpressiveLink>
        </button>
      </article>
    </HomeContent>
  );
}
