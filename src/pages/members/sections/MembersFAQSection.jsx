import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Membership is billed monthly and you can cancel anytime from your receipt email (and later, your member portal if enabled).",
  },
  {
    q: "Is this a donation or a purchase?",
    a: "It’s a recurring contribution that supports our nonprofit mission. Your receipt will reflect the payment details for your records.",
  },
  {
    q: "Do I get a pin or branded items?",
    a: "Yes—members may receive branded thank-you items (seasonal/limited). Specific items can vary based on availability.",
  },
  {
    q: "Can businesses join?",
    a: "Absolutely. The Enterprise Partner tier is designed for businesses and organizations that want deeper collaboration and visibility.",
  },
];

export default function MembersFAQSection() {
  return (
    <section className="grid gap-5 w-full p-5 lg:px-35">
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
            <Heading className="text-base">{item.q}</Heading>
            <p className="text-sm text-neutral-700">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
