import { NavLink } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import ExpressiveLink from "../../components/ui/expressive/ExpressiveLink";
import ExpressiveNumber, {
  Generator,
} from "../../components/ui/expressive/ExpressiveNumber";

export default function Home() {
  return (
    <>
      <section className="flex justify-start items-end w-full mb-20 min-h-[80vh] md:min-h-screen">
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
        <div className="grid gap-3 absolute w-full md:w-[70vw] md:m-35 md:p-0 p-5 justify-self-center opacity-90">
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
              <ExpressiveLink>SERVE</ExpressiveLink>
            </button>
            <button className="border-5 rounded-2xl font-bold w-fit px-10 py-5 hover:bg-neutral-50/95 border-accent-500 bg-neutral-50/85 text-accent-500 transition-colors">
              <ExpressiveLink>DONATE</ExpressiveLink>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function HomeSection({ className, children, title, caption, to }) {
  return (
    <section
      className={`mt-10 px-5 lg:px-35 w-full h-full justify-items-center items-center grid gap-5 ${className}`}
    >
      <div>
        <h2 className="text-(length:--text-xlg) font-bold text-center w-full">
          {title}
        </h2>
      </div>
      {children}
      <button className="justify-self-end w-fit">
        <ExpressiveLink to={to}>{caption}</ExpressiveLink>
      </button>
    </section>
  );
}

function HomeImpactColumn({ children }) {
  return (
    <article className="w-full grid justify-items-center grid-flow-row">
      {children}
    </article>
  );
}

function HomeNewsCard({ title, caption, src, to }) {
  return (
    <article
      to={to}
      className="relative w-full h-full rounded-xl p-5 flex flex-col items-center bg-neutral-400"
    >
      <img src={src} alt={caption} className="w-full h-fit rounded-x1" />
      <h2 className="text-lg text-neutral-50">{title}</h2>
      <div>
        <p>{caption}</p>
        <div className="bg-accent-500 p-5 text-neutral-50 rounded-2xl justify-self-start w-fit inline-flex">
          <ExpressiveLink className="text-accent-background" href="">
            MORE
          </ExpressiveLink>
        </div>
      </div>
    </article>
  );
}

function HomeResourceCard({ title, caption, src, to }) {
  return (
    <NavLink
      to={to}
      className="relative w-full h-full group overflow-hidden rounded-xl text-accent-background"
    >
      <img
        src={src}
        alt={caption}
        className="inset-0 w-full h-full object-cover transition-transform"
      />
      <div
        className="absolute bottom-0 left-0 w-full p-5 
               bg-gradient-to-t from-black/90 to-transparent
               rounded-xl flex flex-col justify-start"
      >
        <h2 className="text-lg font-bold text-center text-white">{title}</h2>

        <p
          className="text-sm text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden
                 transition-all duration-500
                 group-hover:max-h-100 group-hover:opacity-100"
        >
          {caption}
        </p>
      </div>
      <div className="absolute right-5 top-5 p-1 rounded-4xl bg-black/70 h-fit w-fit">
        <ArrowRightIcon
          className="w-[1em] h-[1em] transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </NavLink>
  );
}
