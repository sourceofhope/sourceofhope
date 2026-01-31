import { useEffect, useState } from "react";
import PageSection from "../../PageSection";
import {
  fetchContent,
  getFeaturedImage,
  getResponsiveImage,
} from "../../../cms";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import Carousel from "../../../components/ui/Carousel";
import { AnchorButton } from "../../../components/ui/Button";
import { ASSET_VERSION } from "../../../routes";

export default function ServeEventsSection() {
  const [majorEvents, setMajorEvents] = useState(null);
  const [recurringEvents, setRecurringEvents] = useState(null);

  useEffect(() => {
    fetchContent("/recurring-event?per_page=3&_embed")
      .then((data) => {
        setRecurringEvents(Array.isArray(data) ? data : data?.data || []);
      })
      .catch(() => {
        setRecurringEvents([]);
      });
  }, []);

  useEffect(() => {
    fetchContent("/featured-event?per_page=12&_embed")
      .then((data) => {
        setMajorEvents(data);
      })
      .catch(() => {
        setMajorEvents([]);
      });
  }, []);

  return (
    <PageSection>
      <article className="w-full grid gap-10">
        <div className="grid gap-3">
          <Title>Upcoming Events</Title>
          <p className="max-w-2xl text-neutral-600">
            Join us at our upcoming gatherings — from major community
            celebrations to the events that make a difference every month.
          </p>
        </div>
        <section className="grid gap-5 min-h-60">
          <Heading className="text-xl">Featured Events</Heading>
          {!majorEvents && <div className="min-h-40 w-full"></div>}
          {majorEvents && majorEvents.length === 0 && (
            <p className="text-neutral-500 w-full text-center">
              No featured events available
            </p>
          )}
          {majorEvents && majorEvents.length > 0 && (
            <Carousel auto showProgress>
              {majorEvents.map((event) => (
                <MajorEventCard key={event.id} post={event} />
              ))}
            </Carousel>
          )}
        </section>
        <section className="grid gap-5 min-h-60">
          <Heading className="text-xl">Recurring Programs</Heading>
          {!recurringEvents && <div className="min-h-40 w-full"></div>}
          {recurringEvents && recurringEvents.length === 0 && (
            <p className="text-neutral-500 w-full text-center">
              No recurring events available
            </p>
          )}
          {recurringEvents && recurringEvents.length > 0 && (
            <Carousel
              auto
              showProgress
              itemsPerView={{ base: 1, md: 2, lg: 3 }}>
              {recurringEvents.map((event) => (
                <CarouselCard key={event.id} post={event} />
              ))}
            </Carousel>
          )}
        </section>
      </article>
    </PageSection>
  );
}

function MajorEventCard({ post }) {
  const [loaded, setLoaded] = useState(false);
  const image = getFeaturedImage(post);
  const src = getResponsiveImage(image, { width: 720 });

  const eventTime = post.acf?.date ? Date.parse(post.acf.date) : NaN;
  const isOutdated = Number.isFinite(eventTime)
    ? eventTime < Date.now()
    : false;

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        bg-white shadow-md
        transition-all duration-500
      ">
      <div className="relative aspect-[16/9]">
        <img
          src={src || `/${ASSET_VERSION}/core/placeholder.webp`}
          alt={image?.alt_text || ""}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 p-6 text-white space-y-2">
          <h3 className="text-2xl font-semibold leading-tight">
            {post.acf?.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur">
              {post.acf?.date
                ? new Date(post.acf.date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Date TBA"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur">
              {post.acf?.location}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6 grid gap-4">
        <p className="text-neutral-700 line-clamp-3">{post.acf?.summary}</p>
        isOutdated ?
        <AnchorButton
          full
          href={post.acf?.event_page.url}
          text="Register Now"
        />
        :
        <div
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={text}
          className={`
        !no-underline group inline-flex items-center
        rounded-2xl px-10 py-5
        text-neutral-950 justify-between bg-neutral-400 hover:bg-neutral-500
        transition-all duration-700 font-semibold w-full
      `}>
          <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
            <span>Event Completed</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function CarouselCard({ post }) {
  const [loaded, setLoaded] = useState(false);
  const image = getFeaturedImage(post);
  const src = getResponsiveImage(image, { width: 420 });

  const eventTime = post.acf?.date ? Date.parse(post.acf.date) : NaN;
  const isOutdated = Number.isFinite(eventTime)
    ? eventTime < Date.now()
    : false;

  return (
    <div
      className="
        group relative shrink-0
        bg-white rounded-2xl overflow-hidden
        shadow-md
      ">
      <div className="relative aspect-video">
        <img
          src={src || `/${ASSET_VERSION}/core/placeholder.webp`}
          alt={image?.alt_text || ""}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
      </div>
      <div className="p-5 grid gap-3">
        <Heading>{post.acf?.title}</Heading>
        <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
          <span className="px-3 py-1 rounded-full bg-neutral-100 border">
            {post.acf?.date
              ? new Date(post.acf.date).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "Date TBA"}
          </span>
          <span className="px-3 py-1 rounded-full bg-neutral-100 border">
            {post.acf?.location}
          </span>
        </div>
        <p className="text-sm text-neutral-600 line-clamp-3">
          {post.acf?.summary}
        </p>
        {isOutdated ? (
          <div
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Event Completed"
            className={`
              pointer-events-none
              select-none
        !no-underline group inline-flex items-center
        rounded-2xl px-10 py-5
        text-neutral-950 justify-between bg-neutral-300 hover:bg-neutral-400
        transition-all duration-700 font-semibold w-full
      `}>
            <span className="flex w-full gap-3 items-center justify-center text-sm md:text-md">
              <span>Event Completed</span>
            </span>
          </div>
        ) : (
          <AnchorButton
            full
            href={post.acf?.event_page.url}
            text="Register Now"
          />
        )}
      </div>
    </div>
  );
}
