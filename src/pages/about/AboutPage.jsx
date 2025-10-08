import ExpressiveAnchor from "../../components/ui/expressive/ExpressiveAnchor";
import ExpressiveLink from "../../components/ui/expressive/ExpressiveLink";
import { HighlightedText } from "../../components/ui/expressive/ExpressiveText";
import Emphasis from "../../components/ui/Emphasis";

import PageHeader from "../PageHeader";
import PageSection from "../PageSection";

import Carousel from "../../components/ui/Carousel";

import { ArrowRightIcon } from "@heroicons/react/20/solid";

export default function AboutPage() {
  return (
    <>
      <PageHeader src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344">
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxlg md:text-xxxlg">
          ABOUT
        </h2>
        <p className="font-semibold text-neutral-300 text-sm pb-10">
          EMPOWERING COMMUNITIES THROUGH DIGNITY, WELLNESS, AND COMPASSION SINCE
          2014
        </p>
      </PageHeader>
      <AboutSection className="justify-items-center py-5 grid gap-3">
        <h2 className="justify-self-start text-xlg md:text-xxlg text-balance font-urbanist">
          We're a <HighlightedText>501(c)(3)</HighlightedText>{" "}
          <span className="hidden md:inline-block">Non-profit</span>{" "}
          Organization
        </h2>
        <p className="text-sm md:text-md text-neutral-600">
          The Source of Hope uplifts people through <strong>health</strong>,{" "}
          <strong>wellness</strong>, and <strong>community support</strong>
          —providing meals, housing help, job placement, and scholarships. We
          focus on skills that last, from holistic health education to outdoor
          training and entrepreneurial mentorship. Independent of government
          funding, our impact is powered by volunteers, partners, and
          donors—building stronger communities, one life at a time.
        </p>
      </AboutSection>
      <AboutSection className="grid md:grid-cols-[6fr_4fr] gap-5 bg-neutral-200 items-center py-10">
        <article className="grid gap-5 self-start">
          <div className="grid gap-3">
            <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
              Founded in 2014 on our{" "}
              <Emphasis>
                <span className="hidden md:inline-block">guiding</span>{" "}
                principle
              </Emphasis>
            </h2>
            <p className="text-sm md:text-md text-neutral-600 px-5 py-0 border-l-2 text-balance">
              "empower with dignity—meet urgent needs while equipping people
              with lifelong skills, wellness, and community so hope becomes
              sustainable."
            </p>
            <p className="px-5 w-fit text-neutral-600">
              <ExpressiveAnchor>
                – Co-founder,{" "}
                <strong className="font-semibold">Quynh Chau Stone</strong>
              </ExpressiveAnchor>
            </p>
          </div>
          <div className="grid gap-3">
            <h3 className="text-sm md:text-md border-b-2 pb-1/2 w-fit font-semibold">
              Mission
            </h3>
            <p className="text-sm md:text-md">
              Bringing hope and healing by providing meals, education, wellness,
              and resources that uplift and empower communities in need.
            </p>
          </div>
          <div className="grid gap-3">
            <h3 className="text-sm md:text-md border-b-2 pb-1/2 w-fit font-semibold">
              Vision
            </h3>
            <p className="text-sm md:text-md">
              A world where every person has the wellness, skills, and community
              to thrive—so cycles of hardship give way to lives of purpose and
              communities that flourish.
            </p>
          </div>
        </article>
        <article className="grid self-center justify-items-center">
          <img className="block w-full aspect-square bg-accent-900 max-w-[350px] rounded-2xl object-cover object-center" />
        </article>
      </AboutSection>
      <AboutSection>
        <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
          Ready to take <HighlightedText>your next step</HighlightedText>?
        </h2>
        <div className="text-sm md:text-md grid gap-5">
          <p>
            <strong className="font-semibold">
              At The Source of Hope, we see every person’s potential—even in the
              face of hardship.
            </strong>{" "}
            Our mission is rooted in compassion and community, offering more
            than just services—we offer dignity, purpose, and a path forward.
            Through holistic wellness and a deep belief in second chances, we
            uplift those facing hunger, housing instability, or loss of hope.
          </p>
          <p>
            Every meal served, every hand extended, is a step toward lasting
            transformation. By working hand-in-hand with volunteers, community
            partners, and donors, we create an ecosystem of support that
            empowers individuals to reclaim their futures.
          </p>
          <p>
            As an independent nonprofit, we receive no government funding—our
            impact is made possible entirely by generous hearts like yours.
            Stand with us in building stronger, healthier communities—one life
            at a time.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-items-center gap-5 text-center text-sm md:text-md">
          <ExpressiveLink className="p-5 rounded-2xl bg-neutral-200 hover:bg-neutral-300 duration-500 transition-colors">
            Apply for Emerging Professional
          </ExpressiveLink>
          <ExpressiveLink className="p-5 rounded-2xl bg-neutral-200 hover:bg-neutral-300 duration-500 transition-colors">
            Volunteer for an Event
          </ExpressiveLink>
          <ExpressiveLink className="p-5 rounded-2xl bg-neutral-200 hover:bg-neutral-300 duration-500 transition-colors">
            Become a Community Sponsor
          </ExpressiveLink>
        </div>
      </AboutSection>
      <AboutSection>
        <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
          Meet Our Team
        </h2>
        <div className="grid gap-5">
          <h3 className="justify-self-center">Executive Board</h3>
          <Carousel>
            <CarouselCard
              name="John Doe"
              title="title"
              caption="caption"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
            <CarouselCard
              name="John Doe"
              title="title"
              caption="caption"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
            <CarouselCard
              name="John Doe"
              title="title"
              caption="caption"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
            <CarouselCard
              name="John Doe"
              title="title"
              caption="caption"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
            <CarouselCard
              name="John Doe"
              title="title"
              caption="caption"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
              href=""
            />
          </Carousel>
        </div>
      </AboutSection>
    </>
  );
}

function CarouselCard({ src, name, title, href, caption }) {
  return (
    <a
      href={href}
      className="relative h-full md:w-1/2 lg:w-1/3 group overflow-hidden rounded-xl text-accent-background aspect-square">
      <img
        src={src}
        alt={caption}
        className="inset-0 w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
      <div
        className="absolute bottom-0 left-0 w-full p-5 
               bg-gradient-to-t from-black/90 to-transparent
               rounded-xl flex flex-col justify-start">
        <h2 className="md:line-clamp-1 text-md text-ellipsis lg:group-hover:text-sm duration-750 transition-all font-semibold text-center text-neutral-50">
          {name}
        </h2>
        <h3 className="md:line-clamp-1 text-sm text-ellipsis text-center text-neutral-200">
          {title}
        </h3>
        <p
          className="text-sm hidden lg:block text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden
                 transition-[height_opacity] duration-750 text-left
                 group-hover:max-h-70 group-hover:opacity-100">
          {caption}
        </p>
      </div>
      <div className="absolute right-5 top-5 p-1 rounded-4xl bg-black/70 h-fit w-fit text-neutral-50">
        <ArrowRightIcon
          className="w-[1em] h-[1em] transition-transform duration-750 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}

export function AboutSection({ className, children }) {
  return (
    <PageSection className={`gap-5 my-5 px-5 lg:px-35 ${className}`}>
      {children}
    </PageSection>
  );
}
