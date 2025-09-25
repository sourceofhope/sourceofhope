import { NavLink } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import ExpressiveLink from "../components/ui/expressive/ExpressiveLink";
import ExpressiveNumber, {
  Generator,
} from "../components/ui/expressive/ExpressiveNumber";

export default function Home() {
  return (
    <>
      <section className="flex justify-start items-end w-full min-h-[80vh] md:min-h-screen">
        <video
          autoPlay
          muted
          loop
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
        <div className="grid gap-3 absolute w-full md:w-[70vh] md:m-35 md:p-0 p-5 justify-self-center opacity-90">
          <h2 className="text-primary-background font-urbanist text-sm md:text-lg">
            THE SOURCE OF HOPE
          </h2>
          <h2 className="text-primary-background font-urbanist text-lg md:text-xlg font-bold">
            EMPOWERING AND PROVIDING THROUGH HEALTH AND WELLNESS.
          </h2>
          <p className="hidden md:block text-accent-background text-justify text-sm">
            We are a non-profit organization dedicated to providing holistic
            health and wellness, education, and support to individuals in need.
            Our team of volunteers is committed to serving the DFW community,
            including at-risk families, veterans, and first responders. Your
            donation helps us ensure that those in need have access to health,
            safety, and resources to live healthier, fulfilling lives.
          </p>
          <div className="flex gap-5 flex-col md:flex-row">
            <button className="border-4 rounded-2xl font-bold w-fit px-10 py-2 bg-accent-identity border-accent-identity text-primary-background/75 hover:text-primary-background/95 transition-colors">
              <ExpressiveLink>DONATE</ExpressiveLink>
            </button>
            <button className="border-4 rounded-2xl font-bold w-fit px-10 py-2 hover:bg-primary-background/95 border-accent-identity bg-primary-background/75 text-accent-identity transition-colors">
              <ExpressiveLink>SERVE</ExpressiveLink>
            </button>
          </div>
        </div>
      </section>
      <HomeSection title="RESOURCES" caption="MORE RESOURCES" to="">
        <div className="w-full h-full grid grid-flow-row md:grid-cols-3 md:grid-rows-2 gap-5 justify-center items-center">
          <HomeResourceCard
            title="EDUCATION FOR HOPE"
            caption="Education for Hope supports students of all ages through tutoring, scholarships, and workforce opportunities. We provide low-income cosmetology students with access to advanced training, partner with The University of Texas at Dallas through the Federal Work-Study program, and offer operational roles that build professional experience. By removing barriers to education, we empower individuals to learn, grow, and create brighter futures for themselves and their families."
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            to=""
          />
          <HomeResourceCard
            title="WELLNESS OF HOPE CLINIC"
            caption="The Wellness of Hope Clinic offers holistic treatments such as fire cupping and lymphatic drainage to low-income individuals, seniors, teachers, and first responders. In partnership with Stone International Wellness Center, we also provide reduced cosmetic services and wellness classes. These therapies restore health, build confidence, and make lasting impacts for people who might otherwise be unable to access care."
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            to=""
          />
          <HomeResourceCard
            title="SERVING HOPE"
            caption="Serving Hope is a volunteer-driven initiative dedicated to providing organic, home-cooked meals to those in need across the Dallas–Fort Worth area. Through partnerships and community support, we nourish homeless individuals, veterans, nursing home residents, and at-risk families. Each event focuses on fresh food, dignity, and connection, ensuring both body and spirit are cared for while building stronger, more compassionate communities."
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            to=""
          />
          <HomeResourceCard
            title="SHARING HOPE"
            caption="Sharing Hope transforms surplus food donations into community impact. Partnering with over 50 nonprofits, we distribute meals and essential supplies to families facing food insecurity across the region. This initiative reduces food waste, strengthens partnerships, and ensures that resources reach those who need them most, turning generosity into daily nourishment for thousands of lives."
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            to=""
          />
          <HomeResourceCard
            title="HOPE FOR THE GREAT OUTDOORS"
            caption="Hope for the Great Outdoors introduces individuals and families to nature through hands-on learning and immersive outdoor experiences. From camping and fishing to survival skills, participants gain confidence while developing a lifelong respect for the environment. By making the outdoors accessible and inclusive, the program creates opportunities for growth, bonding, and wellness in a safe and supportive setting."
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            to=""
          />
          <HomeResourceCard
            title="INTERNATIONAL PARTNER SERVING"
            caption="Our International Partner Serving program extends hope worldwide by collaborating with organizations and volunteers to deliver resources, training, and empowerment. We provide scholarships, educational tools, wellness services, and food support to underserved communities in developing regions. By fostering relationships based on trust and respect, we amplify dignity and self-sufficiency, ensuring that compassion knows no borders and hope reaches people across the globe."
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            to=""
          />
        </div>
      </HomeSection>
      <HomeSection title="IMPACT" caption="MORE IMPACT" to="">
        <p className="text-center">
          Real Results and Powerful Change in Our Community
        </p>
        <div className="flex w-full h-fit gap-10 flex-col md:justify-between md:flex-row">
          <HomeImpactColumn>
            <b className="text-(length:--text-lg)">
              <ExpressiveNumber
                start={1}
                end={16}
                generator={Generator.LINEAR}
              />
            </b>
            <p className="text-sm">Years of Service</p>
          </HomeImpactColumn>
          <HomeImpactColumn>
            <b className="flex text-(length:--text-lg)">
              $
              <ExpressiveNumber
                start={1}
                end={900}
                generator={Generator.EASE_IN_OUT}
              />
              K
            </b>
            <p className="text-sm"> Wellness Aid</p>
          </HomeImpactColumn>
          <HomeImpactColumn>
            <b className="flex text-(length:--text-lg)">
              <ExpressiveNumber
                start={1}
                end={353}
                generator={Generator.EASE_IN_OUT}
              />
              K
            </b>
            <p className="text-sm">Meals Served</p>
          </HomeImpactColumn>
          <HomeImpactColumn>
            <b className="flex text-(length:--text-lg)">
              $
              <ExpressiveNumber
                start={1}
                end={500}
                generator={Generator.EASE_IN_OUT}
              />
              K
            </b>
            <p className="text-sm">Donations Received</p>
          </HomeImpactColumn>
          <HomeImpactColumn>
            <b className="flex text-(length:--text-lg)">
              <ExpressiveNumber
                start={1}
                end={273}
                generator={Generator.EASE_IN_OUT}
              />
              K
            </b>
            <p className="text-sm">Hours Served</p>
          </HomeImpactColumn>
        </div>
        <div className="flex gap-10 w-full flex-col md:flex-row">
          <video className="w-full h-full bg-accent-identity rounded-2xl"></video>
          <video className="w-full h-full bg-accent-identity rounded-2xl"></video>
        </div>
      </HomeSection>
      <HomeSection title="LATEST NEWS" caption="MORE NEWS" to="">
        <div className="flex w-full h-fit gap-10 flex-col md:justify-between md:flex-row">
          <HomeNewsCard title="Serving Hope" caption="" src="" to="" />
          <HomeNewsCard title="Serving Hope" caption="" src="" to="" />
          <HomeNewsCard title="Serving Hope" caption="" src="" to="" />
        </div>
      </HomeSection>
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
      className="relative w-full h-full rounded-xl p-5 flex flex-col items-center bg-accent-background"
    >
      <img src={src} alt={caption} className="w-full h-fit rounded-x1" />
      <h2 className="text-lg">{title}</h2>
      <div>
        <p>{caption}</p>
        <div className="bg-accent-identity p-5 text-primary-background rounded-2xl justify-self-start w-fit inline-flex">
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
