import {
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  MegaphoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";

const benefits = [
  {
    icon: ChartBarIcon,
    title: "Impact You Can Report",
    text: "Quarterly impact updates show what your sponsorship made possible, ready for your corporate responsibility reporting.",
  },
  {
    icon: UserGroupIcon,
    title: "Purpose Your Team Can Feel",
    text: "Bring your employees to a Serving Hope meal-prep day. Volunteering together builds teams and puts your values into action.",
  },
  {
    icon: MegaphoneIcon,
    title: "Visibility With Purpose",
    text: "Sponsors can be listed on our website and featured in spotlight stories shared with our supporters.",
  },
  {
    icon: BuildingStorefrontIcon,
    title: "New Customers Through Your Door",
    text: "Donate gift cards or offer a HOPE code, and we'll introduce your business to supporters who choose businesses that give back.",
  },
  {
    icon: DocumentCheckIcon,
    title: "Tax-Deductible Giving",
    text: "The Source of Hope is a 501(c)(3) nonprofit (EIN 46-2491772). Every monthly gift comes with an emailed receipt for your records.",
  },
  {
    icon: CalendarDaysIcon,
    title: "A Commitment That Flexes",
    text: "Give monthly by card and change or cancel anytime. Prefer an invoice or an annual gift? Our team can help.",
  },
];

export default function MembersBenefitsSection() {
  return (
    <PageSection className="bg-neutral-200 py-15">
      <SectionHeading
        eyebrow="For businesses"
        title="Why local businesses sponsor hope">
        Sponsorship is a simple way to show your community what your business
        stands for.
      </SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="grid content-start gap-3 bg-neutral-50 rounded-2xl shadow-sm p-5 border-t-4 border-accent-500">
            <Icon className="w-10 h-10 text-accent-500" aria-hidden="true" />
            <h3 className="font-urbanist font-bold text-lg text-primary-800">
              {title}
            </h3>
            <p className="text-sm text-neutral-600">{text}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}
