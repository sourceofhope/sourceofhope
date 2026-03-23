import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import Bold from "@/components/ui/Bold";

const faqs = [
  {
    question: "What is planned giving?",
    answer: (
      <p>
        Planned giving allows donors to make charitable gifts through their
        estate plans or through strategic financial vehicles — such as{" "}
        <Bold>wills</Bold>, <Bold>trusts</Bold>,{" "}
        <Bold>retirement accounts</Bold>, or <Bold>life insurance</Bold>.
      </p>
    ),
  },
  {
    question: "Why should our nonprofit implement a planned giving program?",
    answer: (
      <ul className="list-disc list-inside space-y-1">
        <li>Builds long-term financial sustainability</li>
        <li>Creates future endowment growth</li>
        <li>Strengthens donor loyalty</li>
        <li>Encourages larger transformational gifts</li>
        <li>Requires minimal upfront cost to start</li>
      </ul>
    ),
  },
  {
    question: "What types of planned gifts are most common?",
    answer: (
      <>
        <ul className="list-disc list-inside space-y-1">
          <li>Bequests in a will or trust</li>
          <li>
            Beneficiary designations (retirement accounts, life insurance)
          </li>
          <li>Charitable gift annuities (if appropriate)</li>
        </ul>
        <p className="mt-3">
          <Bold>Start simple</Bold> — bequests alone can significantly impact
          future funding.
        </p>
      </>
    ),
  },
  {
    question: "Who should we approach first?",
    answer: (
      <>
        <ul className="list-disc list-inside space-y-1">
          <li>Loyal long-term donors</li>
          <li>Board members</li>
          <li>Volunteers</li>
          <li>Donors over age 55</li>
          <li>Donors who consistently give annually</li>
        </ul>
        <p className="mt-3 font-semibold text-neutral-800">
          Planned giving is about relationships, not net worth alone.
        </p>
      </>
    ),
  },
  {
    question: "Will this compete with our annual fundraising?",
    answer: (
      <>
        <p>
          <Bold>No — it complements it.</Bold> Planned giving often:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Increases annual giving</li>
          <li>Deepens donor engagement</li>
          <li>Strengthens long-term loyalty</li>
        </ul>
      </>
    ),
  },
  {
    question: "What is the first step?",
    answer: (
      <ol className="list-decimal list-inside space-y-1">
        <li>Establish a simple gift acceptance policy</li>
        <li>Approve bequest language</li>
        <li>Educate your board</li>
        <li>Add planned giving messaging to your website</li>
        <li>Begin conversations with loyal supporters</li>
      </ol>
    ),
  },
];

export default function GivingFAQSection() {
  return (
    <PageSection className="grid gap-8 bg-neutral-50 rounded-3xl">
      <div className="grid gap-1">
        <Heading>PLANNED GIVING</Heading>
        <Title>Frequently Asked Questions</Title>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {faqs.map(({ question, answer }) => (
          <div
            key={question}
            className="bg-white rounded-2xl shadow-sm p-6 grid gap-3 border border-neutral-100">
            <h3 className="font-urbanist font-bold text-md md:text-lg text-neutral-900">
              {question}
            </h3>
            <div className="text-sm md:text-md text-neutral-700">{answer}</div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
