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

export default function EducationHopeProgram() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet></Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35">
        <article className="grid gap-1 justify-self-start justify-start">
          <Title>Education for Hope Program</Title>
          <Heading>Teaching our Community</Heading>
        </article>
        <article className="grid gap-3 text-sm md:text-md text-neutral-600">
          <p>
            The Education For Hope program offers tutoring services, supports
            cosmetology students, and provides opportunities through the Federal
            Work-Study program in partnership with The University of Texas at
            Dallas. We assist students of all ages by offering scholarships to
            low-income cosmetology students, facilitating advanced beauty
            education, and hiring for operations roles through Work-Study.
          </p>
          <button className="border-5 justify-self-center rounded-2xl font-bold w-fit shadow-sm hover:shadow-lg shadow-accent-500/70 hover:bg-neutral-50/95 border-accent-500 bg-neutral-50/90 duration-500 text-accent-500 opacity-85 hover:opacity-100 transition-[shadow_colors]">
            <ExpressiveAnchor className="px-10 py-5" to="/sourceofhope/about">
              APPLY
            </ExpressiveAnchor>
          </button>
        </article>
        <article className="grid gap-5">
          <Heading>Holistic Practitioners</Heading>
          <Carousel>
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
            <CarouselCard src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344" />
          </Carousel>
        </article>
        <article>
          <Title>Our Scholarship Programs</Title>
          <div className="grid gap-5">
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
            <ExpressiveCard
              className="grid gap-3"
              title="TSOH STUDENTS SHADOWING">
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
          <div className="grid grid-flow-row md:grid-cols-2 gap-5">
            <div></div>
            <img />
          </div>
        </article>
      </section>
    </HeaderFlagContext.Provider>
  );
}

function CarouselCard({ src, alt }) {
  return (
    <button
      className="
    relative h-full
    shrink-0
    flex-[0_0_calc(100%)] 
    md:flex-[0_0_calc(50%-0.625rem)] 
    lg:flex-[0_0_calc(33.333%-0.833rem)]
    group overflow-hidden rounded-xl text-accent-background aspect-square
  ">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
    </button>
  );
}
