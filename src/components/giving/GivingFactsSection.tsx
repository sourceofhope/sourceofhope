import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";

const facts = [
  {
    number: "1",
    text: "Planned giving allows anyone to become a philanthropist regardless of income.",
    color: "bg-amber-50",
  },
  {
    number: "2",
    text: "Planned giving has the highest ROI of all fundraising methods.",
    color: "bg-yellow-100",
  },
  {
    number: "3",
    text: "A typical planned gift is 200 to 300 times the size of a donor's largest annual gift.",
    color: "bg-lime-100",
  },
  {
    number: "4",
    text: "Planned giving leads to an increase of 75% in annual giving!",
    color: "bg-green-100",
  },
  {
    number: "5",
    text: "Planned gifts increase about 5% every year — even during a recession.",
    color: "bg-teal-100",
  },
  {
    number: "6",
    text: 'Only 37% of people over 30 know what "planned giving" means — educate your donors!',
    color: "bg-cyan-100",
  },
  {
    number: "7",
    text: "Planned giving provides a lifeboat for times when economic waters get rough and philanthropy goes down.",
    color: "bg-sky-100",
  },
  {
    number: "8",
    text: "Planned giving is a hallmark of legitimate, prestigious organizations that are serious about long-term goals.",
    color: "bg-slate-100",
  },
];

export default function GivingFactsSection() {
  return (
    <PageSection className="grid gap-8">
      <div className="grid gap-1">
        <Heading>WHY IT MATTERS</Heading>
        <Title>Did You Know?</Title>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {facts.map(({ number, text, color }) => (
          <div
            key={number}
            className={`${color} rounded-2xl p-5 flex items-start gap-4 shadow-sm`}>
            <span className="font-urbanist font-extrabold text-4xl text-neutral-900 leading-none shrink-0">
              {number}
            </span>
            <p className="text-sm md:text-md font-semibold text-neutral-800 leading-snug self-center">
              {text}
            </p>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
