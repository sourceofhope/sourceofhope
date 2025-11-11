import { Helmet } from "react-helmet";
import {
  HeaderFlagContext,
  useHeaderFlag,
} from "../../../components/structure/Header";
import { useEffect } from "react";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";

export default function ServingHopeProgram() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet></Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35">
        <div className="grid gap-3 justify-self-start justify-start">
          <Title>Serving/Sharing Hope Program</Title>
          <Heading>Monthly Feeding with Dignity</Heading>
        </div>
        <article className="grid gap-5 text-sm md:text-md">
          <p>
            <strong className="font-semibold">Serving Hope</strong> and{" "}
            <strong className="font-semibold">Sharing Hope</strong> are two
            cornerstone programs at The Source of Hope, working together to
            fight hunger and support vulnerable communities across the DFW area.
            Whether it's through nourishing meals or distributing donated food
            to partner organizations, these programs aim to spread compassion,
            dignity, and hope.
          </p>
          <button className="my-5 md:hidden rounded-2xl p-5 bg-accent-500 md:w-1/3 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
            <ExpressiveAnchor to="">APPLY</ExpressiveAnchor>
          </button>
        </article>
        <article className="grid gap-5 text-sm md:text-md">
          <Heading>Serving Hope Program</Heading>
          <p>
            Serving Hope is a volunteer-driven initiative dedicated to serving
            organic, home-cooked meals to those in need—homeless individuals,
            veterans, nursing home residents, and at-risk families throughout
            the Dallas-Fort Worth community. Each event provides fresh, holistic
            meals that nourish both the body and spirit.
          </p>
        </article>
        <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 text-sm md:text-md grid gap-2">
          <Heading className=" border-b-2 border-neutral-300 pb-2">
            Volunteer Feeding Times
          </Heading>
          <div className="grid gap-1">
            <div className="flex justify-between">
              <span className="font-medium">Friday Prep</span>
              <span>10:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Saturday Service</span>
              <span>6:00 AM - 1:00 PM</span>
            </div>
          </div>
        </article>
        <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 text-sm md:text-md grid gap-2">
          <Heading className="bold tracking-wide border-b-2 border-neutral-300 pb-2">
            Why Volunteer With Us?
          </Heading>
          <ul className="grid gap-2 pl-3 text-neutral-800 list-disc font-medium">
            <li>Make a real difference in your community</li>
            <li>Support hunger relief through Serving Hope and Sharing Hope</li>
            <li>Gain valuable experience while giving back</li>
            <li>
              Be part of a growing network of compassion-driven individuals
            </li>
          </ul>
        </article>
        <article className="grid gap-5 text-sm md:text-md text-neutral-600">
          <p>
            Every fourth weekend of the month, we gather in locations across
            South Dallas and Collin County to offer food, clothing, haircuts,
            and hygiene services. Visit our Volunteer Page to get involved.
          </p>
          <p>
            Sharing Hope began when generous food donations exceeded our
            immediate needs. Now, The Source of Hope collaborates with 50+
            nonprofits to share surplus food across the region. This helps
            reduce food waste and support families struggling with food
            insecurity. Students can also earn volunteer hours by donating
            select items. Ask your school counselor for details!
          </p>
        </article>

        <article className="grid gap-5">
          <Heading>See our Community Impact</Heading>
          <div className="grid gap-5 md:gap-5 items-center grid-flow-row md:grid-cols-[6fr_5fr] text-sm md:text-md">
            <div className="grid gap-5">
              <p>
                This recap from our January 2025 Serving Hope for Hunger event
                captures the heart of what we do—bringing people together
                through compassion, service, and community care. From preparing
                home-cooked meals to serving each guest with dignity and a
                smile, our volunteers showed what it truly means to nourish both
                body and soul.
              </p>
              <p>
                Every shared meal represents more than food—it's a reminder that
                hope grows stronger when we serve side by side. Together, we're
                building a community filled with kindness, connection, and
                purpose.
              </p>
              <div className="flex-col gap-3 hidden md:flex">
                <button className="w-full rounded-2xl p-5 bg-accent-500 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
                  <ExpressiveAnchor to="">SIGN UP</ExpressiveAnchor>
                </button>
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <iframe
                className="rounded-2xl justify-self-center aspect-video w-full"
                src="https://www.youtube.com/embed/Joax8zGMSkM?si=hkYZqUtVdMLZir0l"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen></iframe>
              <div className="flex-col gap-3 flex md:hidden">
                <button className="w-full rounded-2xl p-5 bg-accent-500 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
                  <ExpressiveAnchor to="">SIGN UP</ExpressiveAnchor>
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </HeaderFlagContext.Provider>
  );
}
