import {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  HeartIcon,
} from "@heroicons/react/20/solid";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";

export default function FormShowcaseSection() {
  return (
    <section className="grid gap-5 w-full bg-neutral-200 p-5 lg:px-35">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title className="text-balance font-urbanist">Why join us?</Title>
      </div>
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-5 place-items-center">
        <FormShowcaseCard
          text="Support programs that deliver meals, wellness care, education, and essential services, creating real and lasting change in the lives of those we serve."
          title="Community Impact">
          <HeartIcon className="w-[4em] aspect-square border-neutral-600 bg-red-400 border-3 rounded-full p-3" />
        </FormShowcaseCard>
        <FormShowcaseCard
          text="Connect with professionals, leaders, volunteers, and advocates who share a commitment to collaboration, service, and positive impact."
          title="Networking">
          <GlobeAltIcon className="w-[4em] aspect-square border-neutral-600 bg-yellow-200 border-3 rounded-full p-3" />
        </FormShowcaseCard>

        <FormShowcaseCard
          text="Enjoy member-only savings on wellness services, events, and partner offerings while supporting businesses that reinvest in the community."
          title="Exclusive Discounts">
          <BuildingStorefrontIcon className="w-[4em] aspect-square border-neutral-600 bg-blue-400 border-3 rounded-full p-3" />
        </FormShowcaseCard>
        <FormShowcaseCard
          text="Members gain access to mentorship, internships, leadership development, and real-world training that empowers students and emerging professionals."
          title="Education Programs">
          <AcademicCapIcon className="w-[4em] aspect-square border-neutral-600 bg-green-400 border-3 rounded-full p-3" />
        </FormShowcaseCard>
      </div>
    </section>
  );
}

function FormShowcaseCard({ title, text, children }) {
  return (
    <article className="relative w-full flex flex-col gap-5 bg-neutral-100 shadow-sm p-5 rounded-2xl h-full">
      <div className="w-full grid justify-items-center">{children}</div>
      <Heading className="text-center">{title}</Heading>
      <p className="md:text-md text-center text-balance">{text}</p>
    </article>
  );
}
