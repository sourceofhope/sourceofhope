import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import { ServingCard } from "./HomeServingSection";



export default function HomeDonationSection() {
  return (
    <section className="py-10 min-h-100 px-5 lg:px-35 w-full h-full grid gap-15 items-center justify-items-center bg-accent-800 text-neutral-50">
      <article className="md:w-1/2 grid gap-5 justify-items-center text-balance text-center">
        <BanknotesIcon className="w-[80px] h-[80px]" />
        <h2 className="text-xxlg font-urbanist font-semibold">
          Invest in holistic wellness
        </h2>
        <p className="text-md md:text-lg text-neutral-300">
          Your generosity helps us bless the communities surrounding The Source
          of Hope with love, support, and transformation.
        </p>
        <button className="border-5 rounded-2xl font-bold w-fit bg-accent-500 border-accent-500 text-neutral-50/75 hover:text-neutral-50/95 transition-colors">
          <ExpressiveLink className="px-10 py-5">DONATE</ExpressiveLink>
        </button>
      </article>
      <ServingCard className="md:hidden w-full max-w-105"/>
    </section>
  );
}
