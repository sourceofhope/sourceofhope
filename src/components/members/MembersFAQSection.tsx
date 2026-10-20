import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import { WELCOME_GIFT_MIN_MONTHLY } from "@/lib/community-partners";

const FAQ = [
  {
    q: "Who can become a Community Sponsor?",
    a: "Any business, organization, or neighbor. Businesses choose a sponsorship level. Individuals give any monthly amount, starting at $1.",
  },
  {
    q: "Is my sponsorship tax-deductible?",
    a: "The Source of Hope is a 501(c)(3) nonprofit (EIN 46-2491772), so contributions are generally tax-deductible as allowed by law, less the value of any welcome gift you accept. You'll receive an emailed receipt. Please check with your tax advisor.",
  },
  {
    q: "How do welcome gift cards work?",
    a: `Our Community Partner businesses donate gift cards to thank new sponsors giving $${WELCOME_GIFT_MIN_MONTHLY} or more a month. After you join, our team reaches out with your welcome gift, while supplies last. Prefer that every dollar go to the mission? Just let us know.`,
  },
  {
    q: "How can my business donate gift cards or offer a HOPE code?",
    a: "Use the form above and our team will follow up. Partners are featured on this page and our store page, and introduced to our supporters.",
  },
  {
    q: "Can we pay by invoice or give annually?",
    a: "Monthly card payments are set up right on this page. For an invoice, an annual gift, or an employee matching program, send us a note through the form above and our team will help.",
  },
  {
    q: "Can I change or cancel anytime?",
    a: "Yes. Email info@thesourceofhope.org anytime to change or cancel your monthly gift.",
  },
];

export default function MembersFAQSection() {
  return (
    <section className="grid gap-5 w-full p-5 pb-15 lg:px-35">
      <div className="grid gap-2">
        <Title>FAQ</Title>
        <p className="text-neutral-700 max-w-[75ch]">
          Quick answers before you join.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {FAQ.map((item) => (
          <article
            key={item.q}
            className="bg-neutral-100 rounded-2xl p-5 shadow-sm grid gap-2">
            <Heading className="text-md">{item.q}</Heading>
            <p className="text-sm text-neutral-700">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
