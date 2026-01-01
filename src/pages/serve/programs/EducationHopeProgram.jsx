import { Helmet } from "react-helmet";
import {
  HeaderFlagContext,
  useHeaderFlag,
} from "../../../components/structure/Header";
import { useEffect } from "react";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Carousel from "../../../components/ui/Carousel";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import ExpressiveCard from "../../../components/ui/expressive/ExpressiveCard";
import { ASSET_VERSION, CANONICAL_URL } from "../../../routes";

import { AnchorButton } from "../../../components/ui/Button";

export default function EducationHopeProgram() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet>
        <title>Education for Hope Program | The Source of Hope</title>
        <meta
          name="description"
          content="Explore The Source of Hope’s Education for Hope Program, providing virtual tutoring, reading and writing mentorship, and academic support through the TSOH ILA Tutoring Program. Empowering students to excel in literacy, test preparation, and long-term academic success."
        />
        <link rel="canonical" href={CANONICAL_URL.educationHope} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.educationHope} />
        <meta
          property="og:title"
          content="Education for Hope Program | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Join the Education for Hope Program to receive free virtual tutoring and academic mentorship. Students gain support in reading, writing, standardized test prep, and literacy development through the TSOH ILA Tutoring Program."
        />
        <meta
          property="og:image"
          content="https://sourceofhope.org/assets/social-share-education-for-hope.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.educationHope} />
        <meta
          name="twitter:title"
          content="Education for Hope Program | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Access free academic support through The Source of Hope’s Education for Hope Program—offering virtual tutoring, reading and writing mentorship, and test preparation to help students thrive."
        />
        <meta
          name="twitter:image"
          content="https://sourceofhope.org/assets/social-share-education-for-hope.jpg"
        />
      </Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35 text-sm md:text-md lg:text-lg">
        <article className="grid gap-3 justify-self-start justify-start">
          <Title>Education for Hope Program</Title>
          <Heading>Teaching our Community</Heading>
        </article>
        <article className="grid gap-3 text-neutral-600">
          <p>
            The Education For Hope program offers tutoring services, supports
            cosmetology students, and provides opportunities through the Federal
            Work-Study program in partnership with The University of Texas at
            Dallas. We assist students of all ages by offering scholarships to
            low-income cosmetology students, facilitating advanced beauty
            education, and hiring for operations roles through Work-Study.
          </p>
          <button className="my-5 md:hidden rounded-2xl p-5 bg-accent-500 md:w-1/3 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
            <ExpressiveAnchor to="">APPLY</ExpressiveAnchor>
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
                you’re seeking a paid federal work-study position, an unpaid
                internship for school credit, or volunteer hours, we have
                opportunities designed to help you grow.
              </p>
              <h4 className="font-semibold">
                Federal Work-Study and Emerging Professional Program (EPP)
                Opportunities
              </h4>
              <p>
                Federal Work-Study and Emerging Professional Program (EPP)
                Opportunities We proudly partner with the University of Texas at
                Dallas for the federal work-study program, providing paid
                positions for students contributing to The Source of Hope.
                Additionally, we offer unpaid internships and volunteer
                opportunities for those looking to gain experience while earning
                school credit or fulfilling volunteer requirements.
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
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen></iframe>
                <iframe
                  className="rounded-2xl aspect-video w-full"
                  src="https://www.youtube.com/embed/V1PZj33e_Ws?si=dlkN_Mz48lxcc8hi"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen></iframe>
                <iframe
                  className="rounded-2xl aspect-video w-full"
                  src="https://www.youtube.com/embed/BrV_ETXz8lk?si=sWyIZm4OwFIajfbR"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen></iframe>
                <iframe
                  className="rounded-2xl aspect-video w-full"
                  src="https://www.youtube.com/embed/L4astrcDt7k?si=5whZXeXhdNyDknF7"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen></iframe>
              </div>
            </ExpressiveCard>
          </div>
        </article>
        <article className="grid gap-5">
          <Title>Tutoring Services</Title>
          <div className="grid grid-flow-row md:grid-cols-[6fr_3fr] gap-5 items-center">
            <div className="grid gap-5 grid-flow-row justify-start">
              <p>
                The Source of Hope offers <strong>virtual tutoring</strong> for
                middle school and high school students—empowering learners to
                grow from anywhere.
              </p>
              <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2 w-full">
                <Heading className="border-b-2 border-neutral-300 pb-2">
                  Tutoring Services
                </Heading>
                <ul className="grid gap-2 pl-3 text-neutral-800 list-disc font-medium">
                  <li>Test prep for STAAR, SAT, and AP exams</li>
                  <li>Math subjects such as Algebra and Geometry</li>
                  <li>English topics including vocabulary and grammar</li>
                </ul>
              </article>
              <p>
                All tutoring sessions are held <strong>virtually</strong>,
                allowing students to participate from any location with flexible
                scheduling options.
              </p>
              <p className="pl-5 py-0 border-l-4 border-accent-600">
                <strong>The Source of Hope</strong> is currently hiring ILA
                (Integrated Language Arts) tutors. Both students and adults can
                apply. Tutors receive <strong>50%</strong> of session earnings,
                while the remaining proceeds support our community programs.
              </p>
              <p>
                If you specialize in a subject not listed above, we still
                encourage you to apply! We’re always expanding our educational
                offerings.
              </p>
            </div>
            <div className="space-y-3 justify-self-end w-full">
              <Carousel
                hideControls
                auto
                className="rounded-2xl object-cover w-full aspect-square">
                <CarouselCard src={`/${ASSET_VERSION}/core/TSOH-Poster.webp`} />
                <CarouselCard src={`/${ASSET_VERSION}/core/TSOH-Poster.webp`} />
                <CarouselCard src={`/${ASSET_VERSION}/core/TSOH-Poster.webp`} />
                <CarouselCard src={`/${ASSET_VERSION}/core/TSOH-Poster.webp`} />
              </Carousel>
              <AnchorButton
                text="GET TUTORING"
                href="https://docs.google.com/forms/d/e/1FAIpQLSezTUqqIB7QuWcX5eL5AeXG-rXRRN6X6ayj7eDIVnQSooEmgQ/viewform"
              />
              <AnchorButton
                text="JOIN OUR TUTORS"
                href="https://docs.google.com/forms/d/e/1FAIpQLSeCTTQRJJuEKLDlp5JopwrhCXiDVrOc5rYohqnZpW1YvppDiw/viewform"
              />
            </div>
          </div>
        </article>
        <article className="grid gap-5 text-neutral-600">
          <Title className="text-neutral-950">Mentors</Title>
          <p>
            The Source of Hope, offers mentorship opportunities through its TSOH
            ILA Tutoring Program. This initiative aims to empower students
            academically by providing individualized virtual mentorship in
            reading and writing.
          </p>
          <p>
            Tutors can assist students in preparing for standardized tests like
            STAAR and SAT/ACT, analyzing literature, and developing writing
            skills. Prospective tutors should have reliable internet access,
            experience with virtual meeting platforms (e.g., Zoom, Google Meet),
            and be comfortable with English.
          </p>
        </article>
      </section>
    </HeaderFlagContext.Provider>
  );
}

function CarouselCard({ src, alt }) {
  return (
    <button
      className="
    relative w-full
    group overflow-hidden rounded-2xl text-accent-background aspect-square
  ">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
      <div className="absolute bottom-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl h-[60%] w-full text-left">
        <div className="absolute bottom-0 w-full p-5 text-neutral-50">
          <p className="text-sm uppercase font-semibold">Education For Hope</p>
          <p className="text-lg font-bold">Empowering minds everywhere</p>
        </div>
      </div>
    </button>
  );
}
