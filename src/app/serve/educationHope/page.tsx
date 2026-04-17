import { Metadata } from "next";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import ExpressiveCard from "@/components/ui/ExpressiveCard";
import Carousel from "@/components/ui/Carousel";
import { AnchorButton } from "@/components/ui/Button";
import Bold from "@/components/ui/Bold";
import HighlightedText from "@/components/ui/HighlightedText";
import Icon from "@/components/ui/Icon";
import {
  AcademicCapIcon,
  CalculatorIcon,
  LanguageIcon,
} from "@heroicons/react/20/solid";
import Block from "@/components/layout/Block";

const ASSET_VERSION = "v2";
const CANONICAL_URL = "https://thesourceofhope.org/serve/education-hope";

export const metadata: Metadata = {
  title: "Education for Hope Program | The Source of Hope",
  description:
    "Explore The Source of Hope's Education for Hope Program, providing virtual tutoring, reading and writing mentorship, and academic support through the TSOH ILA Tutoring Program. Empowering students to excel in literacy, test preparation, and long-term academic success.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Education for Hope Program | The Source of Hope",
    description:
      "Join the Education for Hope Program to receive free virtual tutoring and academic mentorship. Students gain support in reading, writing, standardized test prep, and literacy development through the TSOH ILA Tutoring Program.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education for Hope Program | The Source of Hope",
    description:
      "Access free academic support through The Source of Hope's Education for Hope Program—offering virtual tutoring, reading and writing mentorship, and test preparation to help students thrive.",
  },
};

export default function EducationHope() {
  return (
    <>
      <Block />
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <article className="grid gap-3 justify-self-start justify-start">
          <Title>Education for Hope</Title>
          <Heading>Teaching our Community</Heading>
        </article>
        <article className="grid gap-3">
          <p>
            <Bold>The Education For Hope</Bold> program offers tutoring
            services, supports cosmetology students, and provides opportunities
            through the{" "}
            <HighlightedText>Federal Work-Study program</HighlightedText> in
            partnership with <Bold>The University of Texas at Dallas</Bold>. We
            assist students of all ages by offering scholarships to low-income
            cosmetology students, facilitating advanced beauty education, and
            hiring for operations roles through Work-Study.
          </p>
          <button className="my-5 md:hidden rounded-2xl p-5 bg-accent-500 md:w-1/3 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
            APPLY
          </button>
        </article>
        <article>
          <Title>Our Scholarship Programs</Title>
          <div className="grid gap-5 py-5">
            <ExpressiveCard
              className="grid gap-3"
              title="EMERGING PROFESSIONALS PROGRAM">
              <p>
                Are you looking to gain hands-on experience and develop your
                career? The Source of Hope offers over 15 job opportunities for
                students and professionals eager to make an impact. Whether
                you&apos;re seeking a paid federal work-study position, an
                unpaid internship for school credit, or volunteer hours, we have
                opportunities designed to help you grow.
              </p>
              <h4 className="font-semibold">
                Federal Work-Study and Emerging Professional Program (EPP)
                Opportunities
              </h4>
              <p>
                We proudly partner with the University of Texas at Dallas for
                the federal work-study program, providing paid positions for
                students contributing to The Source of Hope. Additionally, we
                offer unpaid internships and volunteer opportunities for those
                looking to gain experience while earning school credit or
                fulfilling volunteer requirements.
              </p>
              <h4 className="font-semibold">Scholarship Opportunities</h4>
              <p>
                The Source of Hope provides financial assistance through The
                Source of Hope Scholarship Program, awarding $500 to $20,000
                annually to students based on eligibility. This scholarship
                helps aspiring professionals advance their education, career
                paths, or overall well-being.
              </p>
            </ExpressiveCard>
            <ExpressiveCard
              className="grid gap-3"
              title="Beauty of Education Scholarship Program">
              <p>
                The Source of Hope created this scholarship program in 2013 to
                help aspiring students or those interested in furthering their
                career in the cosmetology field or obtaining a cosmetology
                license. Those awarded will be invited and exposed to
                cosmetology events such as trade shows, meetings and classes of
                which such fees will be covered by the program with support
                valuing $75 to $1,500. Contact us for more information!
              </p>
            </ExpressiveCard>
            <ExpressiveCard
              className="grid gap-3"
              title="Hope Scholarship Program">
              <p>
                The Source of Hope created this scholarship program in 2018 to
                help aspiring students and those in financial need receive
                monetary support to help further their education, career path,
                or to seek betterment of their health and wellness. The Source
                Of Hope selects and awards this scholarship program to a select
                few every year with support valuing from $500 to $20,000.
                Contact us for more information.
              </p>
            </ExpressiveCard>
            <ExpressiveCard className="grid gap-3" title="STUDENT SHADOWING">
              <p>
                The Source of Hope and South Garland High School partnered to
                send a group of students to the Stone International Wellness
                Center to learn more about the holistic healing and what it
                takes to run a holistic clinic.
              </p>
              <div className="grid grid-flow-row md:grid-cols-2 gap-5">
                <iframe
                  className="rounded-2xl aspect-video w-full"
                  src="https://www.youtube.com/embed/K7WGjKoaqto?si=jnRQICT46qhuMqrk"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>
                <iframe
                  className="rounded-2xl aspect-video w-full"
                  src="https://www.youtube.com/embed/V1PZj33e_Ws?si=dlkN_Mz48lxcc8hi"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>
                <iframe
                  className="rounded-2xl aspect-video w-full"
                  src="https://www.youtube.com/embed/BrV_ETXz8lk?si=sWyIZm4OwFIajfbR"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>
                <iframe
                  className="rounded-2xl aspect-video w-full"
                  src="https://www.youtube.com/embed/L4astrcDt7k?si=5whZXeXhdNyDknF7"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>
              </div>
            </ExpressiveCard>
          </div>
        </article>
        <article className="grid gap-5">
          <Title>Tutoring Services</Title>
          <div className="grid grid-flow-row md:grid-cols-[6fr_3fr] gap-5 items-center">
            <div className="grid gap-5 grid-flow-row justify-start">
              <p>
                The Source of Hope offers <Bold>virtual tutoring</Bold> for
                middle school and high school students—empowering learners to
                grow from anywhere.
              </p>
              <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2 w-full">
                <Heading className="border-b-2 border-neutral-300 pb-2">
                  Tutoring Services
                </Heading>
                <ul className="grid gap-1">
                  <li className="flex flex-row md:items-center gap-3">
                    <Icon className="text-accent-500 aspect-square h-[1em]">
                      <AcademicCapIcon />
                    </Icon>
                    <p>Test prep for STAAR, SAT, and AP exams</p>
                  </li>
                  <li className="flex flex-row md:items-center gap-3">
                    <Icon className="text-accent-500 aspect-square h-[1em]">
                      <CalculatorIcon />
                    </Icon>
                    <p>Math subjects such as Algebra and Geometry</p>
                  </li>
                  <li className="flex flex-row md:items-center gap-3">
                    <Icon className="text-accent-500 aspect-square h-[1em]">
                      <LanguageIcon />
                    </Icon>
                    <p>English topics including vocabulary and grammar</p>
                  </li>
                </ul>
              </article>
              <p>
                All tutoring sessions are held <Bold>virtually</Bold>, allowing
                students to participate from any location with flexible
                scheduling options.
              </p>
              <p className="pl-5 py-0 border-l-4 border-accent-600">
                <Bold>The Source of Hope</Bold> is currently hiring ILA
                (Integrated Language Arts) tutors. Both students and adults can
                apply. Tutors receive <Bold>50%</Bold> of session earnings,
                while the remaining proceeds support our community programs.
              </p>
              <p>
                If you specialize in a subject not listed above,{" "}
                <HighlightedText>
                  we still encourage you to apply!
                </HighlightedText>{" "}
                We&apos;re always expanding our educational offerings.
              </p>
            </div>
            <div className="space-y-3 justify-self-end w-full">
              <div className="rounded-2xl object-cover w-full aspect-square overflow-hidden">
                <Carousel hideControls auto>
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-1.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-2.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-3.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-4.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-5.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-6.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-7.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-8.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-9.webp`}
                  />
                  <CarouselCard
                    src={`/${ASSET_VERSION}/educationHope/Carousel-10.webp`}
                  />
                </Carousel>
              </div>
              <AnchorButton
                className="w-full"
                text="GET TUTORING"
                href="https://docs.google.com/forms/d/e/1FAIpQLSezTUqqIB7QuWcX5eL5AeXG-rXRRN6X6ayj7eDIVnQSooEmgQ/viewform"
              />
              <AnchorButton
                className="w-full"
                text="JOIN OUR TUTORS"
                href="https://docs.google.com/forms/d/e/1FAIpQLSeCTTQRJJuEKLDlp5JopwrhCXiDVrOc5rYohqnZpW1YvppDiw/viewform"
              />
            </div>
          </div>
        </article>
        <article className="grid gap-5">
          <Title>Mentors</Title>
          <p>
            <Bold>The Source of Hope</Bold> offers mentorship opportunities
            through its <Bold>TSOH ILA Tutoring Program</Bold>. This initiative
            aims to{" "}
            <HighlightedText>empower students academically</HighlightedText> by
            providing individualized virtual mentorship in reading and writing.
          </p>
          <p>
            Tutors can assist students in preparing for standardized tests like
            the <Bold>STAAR</Bold>, <Bold>SAT</Bold>, and <Bold>ACT</Bold>,
            analyzing literature, and developing writing skills. Prospective
            tutors should have reliable internet access, experience with virtual
            meeting platforms (e.g., Zoom, Google Meet), and be comfortable with
            English.
          </p>
        </article>
      </section>
    </>
  );
}

function CarouselCard({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="relative h-full group overflow-hidden rounded-2xl text-accent-background aspect-square">
      <img
        src={src}
        alt={alt || "Education Hope"}
        className="w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
      <div className="absolute bottom-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl h-[60%] w-full text-left">
        <div className="absolute bottom-0 w-full p-5 text-neutral-50">
          <p className="text-sm uppercase font-semibold">Education For Hope</p>
          <p className="text-lg font-bold">Empowering minds everywhere</p>
        </div>
      </div>
    </div>
  );
}
