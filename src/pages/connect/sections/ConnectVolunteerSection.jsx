import { AnchorButton } from "../../../components/ui/Button";
import Carousel from "../../../components/ui/Carousel";
import Emphasis from "../../../components/ui/Emphasis";
import Blockquote from "../../../components/ui/text/Blockquote";
import Bold from "../../../components/ui/text/Bold";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";

import { fetchContent } from "../../../cms";
import { useEffect, useState } from "react";

export default function ConnectMapSection() {
  const [majorEvents, setMajorEvents] = useState([]);
  const [recurringEvents, setRecurringEvents] = useState([]);

  useEffect(() => {
    fetchContent("events", "&per_page=10")
      .then((data) => {
        setMajorEvents(data.filter((e) => e.acf?.event_type === "major"));
        setRecurringEvents(
          data.filter((e) => e.acf?.event_type === "recurring")
        );
      })
      .catch(() => {
        setMajorEvents([]);
        setRecurringEvents([]);
      });
  }, []);

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

        {majorEvents.length === 0 && (
          <p className="text-neutral-500">No major events scheduled.</p>
        )}

        {majorEvents.map((event) => (
          <MajorEventCard
            key={event.id}
            title={event.title.rendered}
            src={event.acf?.hero_image?.url}
            alt={event.title.rendered}
            href={event.acf?.cta_link}>
            <div className="grid md:grid-cols-[7fr_3fr] gap-3 items-end">
              <div className="flex flex-col gap-5">
                <p className="text-sm items-center h-fit text-neutral-600 rounded-full border-2 border-neutral-500 bg-neutral-300 w-fit px-3 py-1">
                  {event.acf?.event_date} · {event.acf?.location}
                </p>
                <p className="text-sm md:text-md">{event.acf?.summary}</p>
              </div>
              <AnchorButton
                className="text-sm md:text-md"
                text="Register Now"
              />
            </div>
          </MajorEventCard>
        ))}

        <Heading>Recurring Events</Heading>

        {recurringEvents.length === 0 && (
          <p className="text-neutral-500">No recurring events available.</p>
        )}

        {recurringEvents.length > 0 && (
          <Carousel auto={true}>
            {recurringEvents.map((event) => (
              <CarouselCard
                key={event.id}
                title={event.title.rendered}
                location={event.acf?.location}
                summary={event.acf?.summary}
                date={event.acf?.event_date}
                src={event.acf?.hero_image?.url}
                alt={event.title.rendered}
                href={event.acf?.cta_link}
              />
            ))}
          </Carousel>
        )}
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
