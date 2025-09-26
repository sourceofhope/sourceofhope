import { DefaultGenerator } from "../../components/ui/expressive/DefaultGenerator";
import ExpressiveLink from "../../components/ui/expressive/ExpressiveLink";
import { HighlightedText } from "../../components/ui/expressive/ExpressiveText";
import HomeVisionSection from "./HomeVisionSection";

export default function Home() {
  return (
    <>
      <section className="flex justify-start items-end w-full mb-10 min-h-[80vh] md:min-h-screen">
        <video
          controls={false}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-0 top-0 z-0 h-[80vh] md:h-full w-full object-cover"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, white 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, white 70%, transparent 100%)",
          }}
          preload="auto"
          disablePictureInPicture
        >
          <source
            src="https://static.vecteezy.com/system/resources/previews/041/753/968/mp4/time-lapse-sayans-foggy-mountains-of-russia-free-video.mp4"
            type="video/mp4"
          />
        </video>
        <div className="grid gap-3 absolute w-full md:w-[70vw] md:m-35 md:max-w-[70vh] lg:p-0 p-5 justify-self-center opacity-90">
          <h2 className="text-neutral-50 font-urbanist text-md md:text-lg font-bold">
            THE SOURCE OF HOPE
          </h2>
          <h2 className="text-neutral-50 font-urbanist text-lg md:text-xlg font-bold">
            EMPOWERING AND PROVIDING THROUGH HEALTH AND WELLNESS.
          </h2>
          <p className="hidden md:block text-neutral-300 text-justify text-sm">
            We are a non-profit organization dedicated to providing holistic
            health and wellness, education, and support to individuals in need.
            Our team of volunteers is committed to serving the DFW community,
            including at-risk families, veterans, and first responders. Your
            donation helps us ensure that those in need have access to health,
            safety, and resources to live healthier, fulfilling lives.
          </p>
          <div className="flex gap-5 flex-col md:flex-row">
            <button className="border-5 rounded-2xl font-bold w-fit px-10 py-5 bg-accent-500 border-accent-500 text-neutral-50/75 hover:text-neutral-50/95 transition-colors">
              <ExpressiveLink>DONATE</ExpressiveLink>
            </button>
            <button className="border-5 rounded-2xl font-bold w-fit px-10 py-5 hover:bg-neutral-50/95 border-accent-500 bg-neutral-50/85 text-accent-500 transition-colors">
              <ExpressiveLink>LEARN MORE</ExpressiveLink>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export function HomeSection({ className, children, title, caption, to }) {
  return (
    <section
      className={`my-5 px-5 lg:px-35 w-full h-full justify-items-center items-center grid gap-5 ${className}`}
    >
      <HighlightedText generator={DefaultGenerator.EASE_IN}>
        <h2 className="text-lg">
          {title}
        </h2>
      </HighlightedText>
      {children}
      <button className="justify-self-end w-fit text-neutral-600">
        <ExpressiveLink className="text-sm" to={to}>{caption}</ExpressiveLink>
      </button>
    </section>
  );
}