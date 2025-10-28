import { useRef, useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/20/solid";

import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";

export default function ServeProgramsSection() {
  const left = true;
  const right = false;

  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    const handleScroll = () => {
      const rectangle = element.getBoundingClientRect();
      const height = window.innerHeight;
      const visible = 1 - Math.min(Math.max(rectangle.top / height, 0), 1);
      setProgress(visible);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 1 - progress;

  return (
    <>
      <section className="relative w-full pt-5 grid gap-5 bg-neutral-200">
        <div className="grid gap-1 justify-self-start justify-start md:px-35 px-5">
          <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
            Make an Impact Today
          </h2>
          <h3 className="text-sm md:text-md text-accent-700 font-semibold">
            VOLUNTEER FOR ONE OF OUR PROGRAMS
          </h3>
        </div>
        <article
          ref={ref}
          className="[--base-padding:0px] md:[--base-padding:80px]"
          style={{
            paddingLeft: `calc(${scale} * var(--base-padding))`,
            paddingRight: `calc(${scale} * var(--base-padding))`,
            transition: "padding 0.15s linear",
            willChange: "padding",
          }}>
          <ServingArticle
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
            title="SERVING HOPE"
            caption="Every meal served. Every smile shared. Together."
            side={left}
            tagline="Volunteer at Our Next Event">
            <div className="flex gap-2 items-center">
              <p className="text-balance text-sm md:text-md max-w-fit text-neutral-700">
                2627 South Ervay Street Dallas, TX 75215
              </p>
              <MapPinIcon className="w-[16px] h-[16px]" />
            </div>
            <p className="text-balance text-sm md:text-md">
              Every fourth Friday and Saturday, our volunteers gather to cook,
              package, and serve hot home-cooked meals to those experiencing
              homelessness, seniors, and students in need. Serving Hope also
              provides free haircuts, showers, clothing, and meals to first
              responders, underprivileged families, and emerging professionals.
              It’s more than food—we serve dignity, compassion, and connection.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveAnchor className="text-sm text-accent-500" to="">
                Volunteer at Our Next Event
              </ExpressiveAnchor>
            </button>
          </ServingArticle>
          <ServingArticle
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
            title="EDUCATION FOR HOPE"
            caption="Empowering through mentorship."
            side={right}>
            <p className="text-balance text-sm md:text-md">
              Through our ILA Tutoring Program, we empower students with
              individualized mentorship in reading and writing. Tutors work
              one-on-one to inspire confidence, critical thinking, and a
              lifelong love of learning. By helping students reach academic
              goals, we build stronger foundations for brighter futures.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveLink className="text-sm text-accent-500" to="">
                Become a Tutor
              </ExpressiveLink>
            </button>
          </ServingArticle>
          <ServingArticle
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
            title="WELLNESS OF HOPE"
            caption="Healing body and spirit."
            side={left}>
            <p className="text-balance text-sm md:text-md">
              In partnership with Stone International Wellness Center, the
              Wellness of Hope program offers free or reduced holistic
              treatments—such as fire cupping, lymphatic drainage, and ear
              detox—to low-income families, first responders, teachers, and
              seniors. We believe that when the body is healed, the spirit
              follows—because wellness is hope in action.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveLink className="text-sm text-accent-500" to="">
                Support Community Wellness
              </ExpressiveLink>
            </button>
          </ServingArticle>
          <ServingArticle
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
            title="SHARING HOPE"
            caption="Extending love beyond borders."
            side={right}>
            <div className="flex gap-2 items-center">
              <p className="text-balance text-sm md:text-md max-w-fit text-neutral-700">
                2627 South Ervay Street Dallas, TX 75215
              </p>
              <MapPinIcon className="w-[16px] h-[16px]" />
            </div>
            <p className="text-balance text-sm md:text-md">
              Sharing Hope focuses on distributing meals, hygiene kits, and
              resources to other nonprofits, shelters, and community
              organizations across North Texas. By partnering with local
              missions and outreach centers, we multiply our impact—ensuring
              every donated meal reaches the hands of those who need it most.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveLink className="text-sm text-accent-500" to="">
                Partner with Us
              </ExpressiveLink>
            </button>
          </ServingArticle>
          <ServingArticle
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
            title="HOPE FOR THE GREAT OUTDOORS"
            caption="Connecting people to nature and purpose."
            side={left}>
            <p className="text-balance text-sm md:text-md">
              Led by founder Wesley Stone, a retired wildlife biologist, this
              program teaches outdoor education, camping, fishing, hunting, and
              survival skills with an emphasis on safety, stewardship, and
              self-reliance. Hope for the Great Outdoors reconnects people with
              nature and encourages responsibility, teamwork, and resilience
              through annual community camping trips and hands-on training.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveLink className="text-sm text-accent-500" to="">
                Join the Next Outdoor Experience
              </ExpressiveLink>
            </button>
          </ServingArticle>
          <ServingArticle
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
            title="INTERNATIONAL PARTNER SERVING"
            caption="Global compassion in action."
            side={right}>
            <p className="text-balance text-sm md:text-md">
              The Source of Hope extends its mission worldwide through
              international partnerships providing food, educational supplies,
              and wellness aid to communities in Southeast Asia and beyond. By
              collaborating with local leaders and volunteers, we bring
              sustainable resources and hope to those facing poverty, disaster,
              and hardship—proving that kindness knows no borders.
            </p>
            <button className="w-fit font-semibold">
              <ExpressiveLink className="text-sm text-accent-500" to="">
                Learn About Global Outreach
              </ExpressiveLink>
            </button>
          </ServingArticle>
        </article>
      </section>
    </>
  );
}

function ServingArticle({ src, title, caption, children, side = false }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    const handleScroll = () => {
      const rectangle = element.getBoundingClientRect();
      const height = window.innerHeight;
      const visible = Math.min(Math.max(rectangle.top / height, 0), 1);
      setProgress(visible);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const brightness = 1 - progress * 0.35;

  return (
    <article
      ref={ref}
      className={`md:sticky top-0 md:h-screen w-full overflow-hidden [--base-brightness:0] md:[--base-brightness:1]`}
      style={{
        filter: `brightness(calc(${brightness} * var(--base-padding)))`,
      }}>
      <img
        className="hidden md:block md:absolute inset-0 h-full w-full object-cover brightness-[.8] contrast-[1.1] rounded-t-4xl"
        src={src}
        alt={caption}
      />
      <ServingLayer title={title} caption={caption} side={side}>
        {children}
      </ServingLayer>
    </article>
  );
}

function ServingCard({ title, caption, children }) {
  return (
    <div className="lg:w-1/3 flex flex-col gap-3 rounded-2xl shadow-2x overflow-hidden h-fit py-5 px-10 bg-neutral-50 text-neutral-950">
      <h2 className="text-sm font-bold text-primary-700 uppercase">{title}</h2>
      <p className="text-lg font-urbanist font-semibold">{caption}</p>
      {children}
    </div>
  );
}

function ServingLayer({ title, caption, children, side = false }) {
  return (
    <div
      className={`md:absolute md:left-1/2 md:-translate-x-1/2 inset-y-0 w-screen grid items-center justify-items-center p-5 lg:px-25 z-10 ${
        side ? "md:justify-items-start" : "justify-items-end"
      }`}>
      <ServingCard title={title} caption={caption}>
        {children}
      </ServingCard>
    </div>
  );
}
