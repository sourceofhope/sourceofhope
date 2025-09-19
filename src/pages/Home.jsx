import { NavLink } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import ExpressiveLink from "../components/ui/ExpressiveLink";

export default function Home() {
  return (
    <>
      <section className="flex justify-start items-end w-full min-h-screen">
        <video
          autoPlay
          muted
          loop
          className="absolute left-0 top-0 z-0 h-full w-full object-cover"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, white 70%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, white 70%, transparent 100%)',
          }}
          preload="auto"
          disablePictureInPicture
        >
          <source src="https://static.vecteezy.com/system/resources/previews/041/753/968/mp4/time-lapse-sayans-foggy-mountains-of-russia-free-video.mp4" type="video/mp4" />
        </video>
        <div className="grid gap-3 absolute w-full md:w-[45%] md:m-35 md:p-0 p-5 justify-self-center opacity-90">
          <h2 className="text-accent-identity text-md md:text-lg ">
            Empower and provide hope to individuals in need through health and
            wellness.
          </h2>
          <p className="hidden md:block text-accent-background text-justify text-sm">
            We are a non-profit organization dedicated to providing holistic
            health and wellness, education, and support to individuals in need.
            Our team of volunteers is committed to serving the DFW community,
            including at-risk families, veterans, and first responders. Your
            donation helps us ensure that those in need have access to health,
            safety, and resources to live healthier, fulfilling lives.
          </p>
          <button className="border-4 rounded-2xl w-fit px-5 py-2 border-accent-identity text-accent-identity">
            <ExpressiveLink>DONATE</ExpressiveLink>
          </button>
        </div>
      </section>
      <section className="px-5 mt-10 lg:px-35 w-full h-full grid grid-flow-row md:grid-cols-3 md:grid-rows-2 gap-5 justify-center items-center">
        <HomeResourceCard
          title="Serving Hope"
          caption="Serving Hope is a volunteer-driven initiative dedicated to serving organic, home-cooked meals to those in need—homeless individuals, veterans, nursing home residents, and at-risk families throughout the Dallas-Fort Worth community. Each event provides fresh, holistic meals that nourish both the body and spirit."
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          to=""
        />
        <HomeResourceCard
          title="Education for Hope"
          caption=""
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          to=""
        />
        <HomeResourceCard
          title="International Partner Serving"
          caption=""
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          to=""
        />
        <HomeResourceCard
          title="Wellness of Hope Clinic"
          caption=""
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          to=""
        />
        <HomeResourceCard
          title="Hope for the Great Outdoors"
          caption=""
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          to=""
        />
        <HomeResourceCard
          title="Sharing Hope"
          caption="Sharing Hope began when generous food donations exceeded our immediate needs. Now, The Source of Hope collaborates with 50+ nonprofits to share surplus food across the region. This helps reduce food waste and support families struggling with food insecurity."
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          to=""
        />
      </section>
      <section className="mt-10 px-5 lg:px-35 w-full h-full flex justify-items-center items-center">
          <h2>Celebrating Our Impact</h2>
      </section>
    </>
  );
}

function HomeResourceCard({ title, caption, src, to }) {
  return (
    <NavLink
      to={to}
      className="relative w-full h-full group overflow-hidden rounded-xl text-primary-background"
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
