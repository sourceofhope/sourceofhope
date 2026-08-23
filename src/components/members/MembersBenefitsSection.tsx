import {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  HeartIcon,
} from "@heroicons/react/20/solid";
import Heading from "@/components/ui/Heading";
import Title from "@/components/ui/Title";

export default function MembersBenefitsSection() {
  return (
    <section className="grid gap-5 w-full bg-neutral-200 p-5 lg:px-35">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title className="text-balance font-urbanist">Why join us?</Title>
      </div>

      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-5 place-items-center">
        <Card
          title="Community Impact"
          text="Support programs that deliver education, meals, wellness care, and essential services - creating lasting change.">
          <HeartIcon className="w-[4em] aspect-square bg-neutral-200 text-red-400 rounded-full shadow-sm p-3" />
        </Card>

        <Card
          title="Networking"
          text="Connect with professionals, leaders, volunteers, and advocates committed to collaboration and service.">
          <GlobeAltIcon className="w-[4em] aspect-square bg-neutral-200 text-yellow-200 rounded-full shadow-sm p-3" />
        </Card>

        <Card
          title="Exclusive Discounts"
          text="Enjoy member-only savings on wellness services, events, and partner offerings while reinvesting locally.">
          <BuildingStorefrontIcon className="w-[4em] aspect-square bg-neutral-200 text-blue-400 rounded-full shadow-sm p-3" />
        </Card>

        <Card
          title="Education Programs"
          text="Access mentorship, internships, and leadership development that empowers students and emerging professionals.">
          <AcademicCapIcon className="w-[4em] aspect-square bg-neutral-200 text-green-400 rounded-full shadow-sm p-3" />
        </Card>
      </div>
    </section>
  );
}

function Card({ title, text, children }: any) {
  return (
    <article className="relative w-full flex flex-col gap-5 bg-neutral-100 shadow-sm p-5 rounded-2xl h-full">
      <div className="w-full grid justify-items-center">{children}</div>
      <Heading className="text-center">{title}</Heading>
      <p className="md:text-md text-center text-balance">{text}</p>
    </article>
  );
}
