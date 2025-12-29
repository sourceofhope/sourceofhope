import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { HomeContent } from "../HomePage";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

import Emphasis from "../../../components/ui/Emphasis";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { CANONICAL } from "../../../routes";
import Title from "../../../components/ui/text/Title";

export default function HomeResourcesSection() {
  return (
    <HomeContent className="w-full md:mb-15 p-5 md:py-10 lg:px-15">
      <Title className="mb-10 text-center text-balance">
        We provide a number of{" "}
        <NavLink className="!no-underline" to={CANONICAL.serve}>
          <Emphasis>resources</Emphasis>
        </NavLink>{" "}
        to <HighlightedText>our community</HighlightedText>.
      </Title>
      <div className="w-full grid grid-flow-row md:grid-cols-3 md:grid-rows-2 gap-5 md:gap-10">
        <HomeResourceCard
          title="EDUCATION FOR HOPE"
          to={`serve/${CANONICAL.educationHope}`}
          caption="Education for Hope supports students of all ages through tutoring, scholarships, and workforce opportunities. We provide low-income cosmetology students with access to advanced training, partner with The University of Texas at Dallas through the Federal Work-Study program, and offer operational roles that build professional experience. By removing barriers to education, we empower individuals to learn, grow, and create brighter futures for themselves and their families."
          src="/educationHope/EH-ResourceTile.jpg"
        />
        <HomeResourceCard
          title="WELLNESS OF HOPE CLINIC"
          to={`serve/${CANONICAL.wellnessHope}`}
          caption="The Wellness of Hope Clinic offers holistic treatments such as fire cupping and lymphatic drainage to low-income individuals, seniors, teachers, and first responders. In partnership with Stone International Wellness Center, we also provide reduced cosmetic services and wellness classes. These therapies restore health, build confidence, and make lasting impacts for people who might otherwise be unable to access care."
          src="/wellnessHope/WH-ResourceTile.jpg"
        />
        <HomeResourceCard
          title="SERVING HOPE"
          to={`serve/${CANONICAL.servingHope}`}
          caption="Serving Hope is a volunteer-driven initiative dedicated to providing organic, home-cooked meals to those in need across the Dallas–Fort Worth area. Through partnerships and community support, we nourish homeless individuals, veterans, nursing home residents, and at-risk families. Each event focuses on fresh food, dignity, and connection, ensuring both body and spirit are cared for while building stronger, more compassionate communities."
          src="/servingHope/SH-ResourceTile.jpg"
        />
        <HomeResourceCard
          title="SHARING HOPE"
          to={`serve/${CANONICAL.servingHope}`}
          caption="Sharing Hope transforms surplus food donations into community impact. Partnering with over 50 nonprofits, we distribute meals and essential supplies to families facing food insecurity across the region. This initiative reduces food waste, strengthens partnerships, and ensures that resources reach those who need them most, turning generosity into daily nourishment for thousands of lives."
          src="/sharingHope/SH-ResourceTile.jpg"
        />
        <HomeResourceCard
          title="HOPE FOR THE GREAT OUTDOORS"
          to={`serve/${CANONICAL.outdoorHope}`}
          caption="Hope for the Great Outdoors introduces individuals and families to nature through hands-on learning and immersive outdoor experiences. From camping and fishing to survival skills, participants gain confidence while developing a lifelong respect for the environment. By making the outdoors accessible and inclusive, the program creates opportunities for growth, bonding, and wellness in a safe and supportive setting."
          src="/outdoorHope/OH-ResourceTile.jpeg"
        />
        <HomeResourceCard
          title="INTERNATIONAL PARTNER SERVING"
          to={`serve/${CANONICAL.internationalHope}`}
          caption="Our International Partner Serving program extends hope worldwide by collaborating with organizations and volunteers to deliver resources, training, and empowerment. We provide scholarships, educational tools, wellness services, and food support to underserved communities in developing regions. By fostering relationships based on trust and respect, we amplify dignity and self-sufficiency, ensuring that compassion knows no borders and hope reaches people across the globe."
          src="/internationalHope/IH-ResourceTile.jpeg"
        />
      </div>
    </HomeContent>
  );
}

function HomeResourceCard({ title, caption, src, to }) {
  const [active, setActive] = useState(false);

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="relative min-h-[200px] md:hidden w-full h-full group overflow-hidden rounded-xl aspect-square">
        <HomeResourceCardInner src={src} caption={caption} title={title} />
      </button>
      <NavLink
        to={to}
        className="relative hidden md:block w-full h-full group overflow-hidden rounded-xl aspect-square">
        <HomeResourceCardInner src={src} caption={caption} title={title} />
      </NavLink>
      <section
        className={`
          fixed inset-0 z-50 flex items-end md:hidden
          bg-black/50 backdrop-blur-sm transition-all duration-750
          ${active ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setActive(false)}>
        <article
          onClick={(e) => setActive(false)}
          className={`
            w-full rounded-t-3xl bg-neutral-100 p-6 pb-10
            shadow-2xl transform transition-all duration-750
            ${active ? "translate-y-0" : "translate-y-full"}
          `}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {title}
                </h2>{" "}
                <button
                  onClick={() => setActive(false)}
                  className="rounded-full p-2 hover:bg-neutral-200 transition-colors duration-750">
                  <XMarkIcon className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600">
                {caption}
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end w-fit">
            <ExpressiveLink
              ariaLabel={`Learn more about ${title} at the source of hope`}
              to={`serve/${to}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-700 hover:text-accent-900 transition-colors duration-750">
              Learn More
            </ExpressiveLink>
          </div>
        </article>
      </section>
    </>
  );
}

function HomeResourceCardInner({ src, caption, title }) {
  return (
    <>
      <img
        src={src}
        alt={caption}
        onError={(e) => (e.currentTarget.src = "/core/TSOH-Family.jpg")}
        className="inset-0 w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1] bg-accent-900"
      />
      <div
        className="absolute bottom-0 left-0 w-full p-5 
                bg-gradient-to-t from-black/90 to-transparent
                rounded-xl flex flex-col justify-start">
        <h2 className="md:line-clamp-1 text-md text-ellipsis lg:group-hover:text-sm duration-750 transition-all ease-in-out font-semibold text-center text-neutral-50">
          {title}
        </h2>
        <p
          className="text-sm hidden lg:block text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden
                  transition-[height_opacity] duration-750 text-left
                  group-hover:max-h-70 group-hover:opacity-100 ease-in-out text-balance">
          {caption}
        </p>
      </div>
      <div className="absolute right-5 top-5 p-1 rounded-full bg-black/70 h-fit w-fit text-neutral-50">
        <ArrowRightIcon
          className="w-[1em] h-[1em] transition-transform ease-in-out duration-750 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </>
  );
}
