import { useRef, useEffect, useState } from "react";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";

export default function ServeProgramsSection() {
  return (
    <>
      <section className="relative w-full pt-5 grid gap-5 bg-neutral-200">
        <div className="grid gap-1 justify-self-start justify-start md:px-35 px-5">
          <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
            Make an Impact
          </h2>
          <h3 className="text-sm md:text-md text-accent-700 font-semibold">
            VOLUNTEER FOR ONE OF OUR PROGRAMS
          </h3>
        </div>
        <ServingArticle
          index={1}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
          title="SERVING HOPE"
          caption="Every meal served. Every smile shared."
          side={true}
          tagline="Volunteer at Our Next Event">
          <p className="text-balance text-sm">
            Every fourth Friday and Saturday, our volunteers gather to cook,
            package, and serve fresh meals to those experiencing homelessness,
            seniors, and students in need. More than food, we serve dignity,
            compassion, and community connection.
          </p>
        </ServingArticle>
        <ServingArticle
          index={2}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
          title="EDUCATION FOR HOPE"
          caption="Empowering through mentorship."
          side={false}
          tagline="Become a Tutor">
          <p className="text-balance text-sm">
            Through our ILA Tutoring Program, we empower students with
            individualized reading and writing mentorship. Our tutors not only
            teach—they inspire confidence and a lifelong love of learning.
          </p>
        </ServingArticle>
        <ServingArticle
          index={3}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png"
          title="WELLNESS OF HOPE"
          caption="Healing body and spirit."
          side={true}
          tagline="Support Community Wellness">
          <p className="text-balance text-sm">
            In partnership with Stone International Wellness Center, we offer
            free or reduced holistic treatments to low-income families, first
            responders, and seniors. We believe healing the body helps restore
            the spirit—because wellness is hope in action.
          </p>
        </ServingArticle>
      </section>
    </>
  );
}

function ServingArticle({
  src,
  title,
  caption,
  index,
  tagline,
  to,
  children,
  side = false,
}) {
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

  const margin = progress * 20;
  const brightness = 1 - progress * (0.35);

  return (
    <article
      ref={ref}
      className={`sticky top-0 h-screen w-[calc(100%-${margin}px)] overflow-hidden z-[${
        index * 10
      }]`}
      style={{
        filter: `brightness(${brightness})`,
        marginLeft: `${margin}px`,
        marginRight: `${margin}px`,
        transition: "filter 0.1s linear",
      }}>
      <img
        className="absolute inset-0 w-full h-full object-cover brightness-[.8] contrast-[1.1] rounded-t-4xl"
        src={src}
        alt={caption}
      />
      <ServingLayer
        title={title}
        caption={caption}
        tagline={tagline}
        to={to}
        side={side}>
        {children}
      </ServingLayer>
    </article>
  );
}

function ServingCard({ title, caption, children, tagline, to }) {
  return (
    <div className="lg:w-1/3 flex flex-col gap-3 rounded-2xl shadow-2x overflow-hidden h-fit py-5 px-10 bg-neutral-50 text-neutral-950">
      <h2 className="text-sm font-bold text-primary-700 uppercase">{title}</h2>
      <p className="text-lg font-urbanist font-semibold">{caption}</p>
      {children}
      <button className="w-fit font-semibold">
        <ExpressiveLink className="text-sm text-accent-500" to={to}>
          {tagline}
        </ExpressiveLink>
      </button>
    </div>
  );
}

function ServingLayer({ title, caption, children, tagline, to, side = false }) {
  return (
    <div
      className={`absolute inset-0 grid items-center justify-items-center p-5 lg:px-25 z-10 ${
        side ? "md:justify-items-start" : "justify-items-end"
      }`}>
      <ServingCard title={title} caption={caption} tagline={tagline} to={to}>
        {children}
      </ServingCard>
    </div>
  );
}
