import { HomeSection } from "../HomePage";
import { NavLink } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Emphasis from "../../../components/ui/Emphasis";

export default function HomeResourcesSection() {
  return (
    <HomeSection title="Resources" caption="LEARN MORE" className="w-full">
      <NavLink to="">
        <h2 className="text-lg lg:text-xxlg text-center p-5">
          <Emphasis className="text-accent-500 font-semibold">
            We provide a number of resources
          </Emphasis>{" "}
          to our community.
        </h2>
      </NavLink>
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
  );
}

function HomeResourceCard({ title, caption, src, to }) {
  return (
    <NavLink
      to={to}
      className="relative w-full h-full group overflow-hidden rounded-xl text-accent-background aspect-square"
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
        <h2 className="text-xlg font-bold text-center text-white">{title}</h2>

        <p
          className="text-lg text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden
                 transition-all duration-500 text-justify
                 group-hover:max-h-100 group-hover:opacity-100"
        >
          {caption}
        </p>
      </div>
      <div className="absolute right-5 top-5 p-1 rounded-4xl bg-black/70 h-fit w-fit text-neutral-50">
        <ArrowRightIcon
          className="w-[1em] h-[1em] transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </NavLink>
  );
}
