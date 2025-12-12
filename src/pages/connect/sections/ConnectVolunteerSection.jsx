import { AnchorButton } from "../../../components/ui/Button";
import Carousel from "../../../components/ui/Carousel";
import Emphasis from "../../../components/ui/Emphasis";
import Blockquote from "../../../components/ui/text/Blockquote";
import Bold from "../../../components/ui/text/Bold";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";

export default function ConnectMapSection() {
  return (
    <PageSection className="justify-items-center grid gap-10 relative m-0 text-sm md:text-md lg:text-lg">
      <article className="w-full grid gap-5">
        <Title>Volunteer Opportunities</Title>
        <p>
          Make an Impact--volunteer with The Source of Hope! Join us in Dallas
          and Plano to help provide food, support, and hope to those in need.
          Whether you can volunteer once or regularly, every effort makes a{" "}
          <Emphasis>real difference</Emphasis> in our community.
        </p>
        <Blockquote className="text-balance border-accent-500">
          The Serving Hope takes place every fourth Friday & Saturday of the
          month at Cornerstone Kitchen (2627 S. Ervay Street, Dallas, TX 75215).
        </Blockquote>
        <p>
          Join us <Bold>every fourth Friday & Saturday</Bold> of the month at
          Cornerstone Kitchen (2627 S. Ervay Street, Dallas, TX 75215) for
          Serving Hope, a heartfelt community outreach event hosted by The
          Source of Hope. We prepare and serve fresh, homemade, organic meals to
          over <Emphasis>200 individuals</Emphasis> in need—including senior
          citizens, first responders, veterans, teachers, at-risk families, and
          those experiencing homelessness.
        </p>
      </article>
      <article className="w-full grid gap-5">
        <Heading>Major Events</Heading>
        <MajorEventCard
          title="Hope Run for Hunger"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          alt="Hope Run for Hunger event photo">
          <div className="grid md:grid-cols-[7fr_3fr] gap-3 items-end">
            <div className="flex flex-col gap-5">
              <p className="text-sm items-center h-fit text-neutral-600 rounded-full border-2 border-neutral-500 bg-neutral-300 w-fit px-3 py-1">
                November 23, 2025 · Plano, TX
              </p>
              <p className="text-sm md:text-md">
                Join us in a powerful community run supporting families across
                North Texas.
              </p>
            </div>
            <AnchorButton className="text-sm md:text-md" text="Register Now" />
          </div>
        </MajorEventCard>
        <Heading>Recurring Events</Heading>
        <Carousel auto={true}>
          <CarouselCard
            alt="Quote Here"
            title="The Source of Hope Gala"
            location="Plano, TX"
            summary="Join us at the 2025 The Source of Hope Gala on Dec 6 aims to raise $30K with 300 guests, live music, awards, and support for EPP alumni."
            date="November 23, 2025"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          />
          <CarouselCard
            alt="Quote Here"
            title="November Serving Hope"
            location="Plano, TX"
            summary="Join us at the 2025 The Source of Hope Gala on Dec 6 aims to raise $30K with 300 guests, live music, awards, and support for EPP alumni."
            date="November 23, 2025"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          />
          <CarouselCard
            alt="Quote Here"
            title="December Serving Hope"
            location="Plano, TX"
            summary="Join us at the 2025 The Source of Hope Gala on Dec 6 aims to raise $30K with 300 guests, live music, awards, and support for EPP alumni."
            date="November 23, 2025"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          />
          <CarouselCard
            alt="Quote Here"
            title="Plano Turkey Trot"
            location="Plano, TX"
            summary="Join us at the 2025 The Source of Hope Gala on Dec 6 aims to raise $30K with 300 guests, live music, awards, and support for EPP alumni."
            date="November 23, 2025"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          />
          <CarouselCard
            alt="Quote Here"
            title="The Source of Hope Gala"
            location="Plano, TX"
            summary="Join us at the 2025 The Source of Hope Gala on Dec 6 aims to raise $30K with 300 guests, live music, awards, and support for EPP alumni."
            date="November 23, 2025"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          />
        </Carousel>
      </article>
    </PageSection>
  );
}

function CarouselCard({ title, date, location, summary, src, alt, href }) {
  return (
    <a
      href={href}
      className="
		relative h-full
		shrink-0
		flex-[0_0_calc(100%)] 
		md:flex-[0_0_calc(50%-0.625rem)] 
		lg:flex-[0_0_calc(33.333%-0.833rem)]
		group overflow-hidden rounded-2xl shadow-sm text-accent-700
	">
      <div className="relative w-full rounded-t-2xl hidden md:block">
        <img src={src} alt={alt} className="w-full aspect-video object-cover" />
        <div className="absolute inset-0 aspect-video bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
      </div>
      <div className="w-full rounded-b-2xl top-1/2 h-max p-5 pt-3 text-sm flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Heading className="text-accent-800">{title}</Heading>
          <p className="text-sm items-center h-fit text-neutral-600 rounded-full border-2 border-neutral-500 bg-neutral-300 w-fit px-3 py-1">
            {date} · {location}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p>{summary}</p>
          <AnchorButton className="text-sm md:text-md" text="Register Now" />
        </div>
      </div>
    </a>
  );
}

function MajorEventCard({ title, src, alt, href, children }) {
  return (
    <a className="relative w-full group" href={href}>
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="w-full aspect-video md:aspect-9/2 rounded-t-2xl object-cover"
        />
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
      </div>
      <div
        className="
          relative bottom-0 left-0 w-full
          p-5
          rounded-b-2xl 
          bg-neutral-100 backdrop-blur-sm
          shadow-lg
          transform transition-all
          flex flex-col gap-3
        ">
        <Heading className="text-accent-800">{title}</Heading>
        <div className="text-accent-700 leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </a>
  );
}
