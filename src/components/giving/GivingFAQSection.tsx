import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import Bold from "@/components/ui/Bold";

const faqs = [
  {
    question: "What is planned giving?",
    answer: (
      <p>
        Planned giving is a way to support The Source of Hope through a future
        gift, often as part of your overall financial or estate plans. This can
        include a gift in your <Bold>will</Bold>, <Bold>trust</Bold>,{" "}
        <Bold>retirement account</Bold>, or <Bold>life insurance policy</Bold>.
      </p>
    ),
  },
  {
    question: "Do I need to be wealthy to make a planned gift?",
    answer: (
      <p>
        <Bold>No.</Bold> Planned giving is not only for wealthy individuals.
        Many supporters choose to leave a meaningful future gift of any size as
        a way to reflect their values and make a lasting difference.
      </p>
    ),
  },
  {
    question: "What types of planned gifts are most common?",
    answer: (
      <ul className="list-disc list-inside space-y-1">
        <li>A gift through your will or living trust</li>
        <li>A beneficiary designation on a retirement account</li>
        <li>A beneficiary designation on a life insurance policy</li>
        <li>Other charitable giving arrangements that fit your goals</li>
      </ul>
    ),
  },
  {
    question:
      "Can I support The Source of Hope and still take care of my family?",
    answer: (
      <p>
        Yes. A planned gift is often a way to care for both your loved ones and
        the causes you value. Many supporters choose a gift option that allows
        them to provide for family first while also leaving a legacy of hope.
      </p>
    ),
  },
  {
    question: "Do I need an attorney or financial advisor?",
    answer: (
      <p>
        In many cases, it is helpful to speak with your attorney, financial
        advisor, or estate planning professional to make sure your wishes are
        clearly documented. They can help you choose the giving option that best
        fits your personal goals.
      </p>
    ),
  },
  {
    question: "Can I make a planned gift if I already give annually?",
    answer: (
      <p>
        Absolutely. Many of our most faithful supporters continue their regular
        giving while also choosing to make a planned gift as part of their
        long-term legacy.
      </p>
    ),
  },
  {
    question: "How will my planned gift make an impact?",
    answer: (
      <p>
        Your gift can help strengthen the future of The Source of Hope and
        support our mission for years to come. Planned gifts help create lasting
        impact for the individuals, families, and communities we serve.
      </p>
    ),
  },
  {
    question:
      "How do I let you know if I have included The Source of Hope in my plans?",
    answer: (
      <p>
        We would be honored to know about your intentions so we can thank you
        and ensure your gift is used in alignment with your wishes. You can
        reach out to our team directly to start a confidential conversation.
      </p>
    ),
  },
];

export default function GivingFAQSection() {
  return (
    <PageSection className="grid gap-8 rounded-3xl bg-neutral-50">
      <div className="grid gap-1">
        <Heading>PLANNED GIVING</Heading>
        <Title>Frequently Asked Questions</Title>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {faqs.map(({ question, answer }) => (
          <div
            key={question}
            className="grid gap-3 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="font-urbanist text-md font-bold text-neutral-900 md:text-lg">
              {question}
            </h3>
            <div className="text-sm text-neutral-700 md:text-md">{answer}</div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
