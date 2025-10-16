import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { BanknotesIcon } from "@heroicons/react/20/solid";

export default function ServeDonationSection() {
  return (
    <section className="py-10 px-5 lg:px-35 w-full grid gap-15 items-center justify-items-center bg-accent-800 text-neutral-50">
      <article className="md:w-1/2 grid gap-5 justify-items-center text-balance text-center">
        <BanknotesIcon className="w-[80px] h-[80px]" />
        <h2 className="text-lg md:text-xlg font-urbanist font-semibold">
          INVEST IN HOLISTIC WELLNESS
        </h2>
        <p className="text-sm md:text-md lg:text-lg text-neutral-300">
          Your generosity helps us bless the communities surrounding The Source
          of Hope with love, support, and transformation.
        </p>
        <button className="border-5 rounded-2xl font-bold w-fit shadow-sm hover:shadow-lg shadow-accent-500/70 bg-accent-500 border-accent-500 text-neutral-50/75 duration-500 hover:text-neutral-50/95 opacity-85 hover:opacity-100 transition-[shadow_colors]">
          <ExpressiveLink className="px-10 py-5">DONATE</ExpressiveLink>
        </button>
      </article>
    </section>
  );
}
