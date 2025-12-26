import PageSection from "../../PageSection";

import Emphasis from "../../../components/ui/Emphasis";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import Blockquote from "../../../components/ui/text/Blockquote";
import Bold from "../../../components/ui/text/Bold";
import Carousel from "../../../components/ui/Carousel";
import { AnchorButton } from "../../../components/ui/Button";
import { useEffect, useState } from "react";
import { fetchContent } from "../../../cms";

export default function ServeShowcaseSection() {
  const [majorEvents, setMajorEvents] = useState([]);
  const [recurringEvents, setRecurringEvents] = useState([]);

  useEffect(() => {
    fetchContent("/recurring-event", "&per_page=10")
      .then((data) => {
        console.log("Recurring response:", data);
        setRecurringEvents(Array.isArray(data) ? data : data?.data || []);
      })
      .catch((err) => {
        console.error("Recurring error:", err);
        setRecurringEvents([]);
      });
  }, []);

  useEffect(() => {
    fetchContent("/featured-event", "&per_page=10")
      .then((data) => {
        setMajorEvents(data);
      })
      .catch(() => {
        setMajorEvents([]);
      });
  }, []);

  return (
    <PageSection className="justify-items-center grid gap-5 text-sm md:text-md lg:text-lg">
      <article className="w-full grid gap-10">
        <div className="grid gap-3">
          <Title>Upcoming Events</Title>
          <p className="max-w-2xl text-neutral-600">
            Join us at our upcoming gatherings — from major community
            celebrations to the events that make a difference every month.
          </p>
        </div>
        <section className="grid gap-5">
          <Heading className="text-xl">Featured Events</Heading>
          {majorEvents.length === 0 && (
            <p className="text-neutral-500">No major events scheduled.</p>
          )}
          <div className="grid lg:grid-cols-2 gap-6">
            {majorEvents.map((event) => (
              <MajorEventCard key={event.id} post={event} />
            ))}
          </div>
        </section>
        <section className="grid gap-5">
          <Heading className="text-xl">Recurring Programs</Heading>
          {recurringEvents.length === 0 && (
            <p className="text-neutral-500">No recurring events available.</p>
          )}
          {recurringEvents.length > 0 && (
            <Carousel auto itemsPerView={{ base: 1, md: 2, lg: 3 }}>
              {recurringEvents.map((event) => (
                <CarouselCard key={event.id} post={event} />
              ))}
            </Carousel>
          )}
        </section>
      </article>
      <div className="grid gap-1 justify-self-start justify-start ">
        <Title>Be the Source Of Hope</Title>
        <Heading>
          EVERY MEAL SERVED, SMILE SHARED, AND ACT OF LOVE MAKES A DIFFERENCE.
        </Heading>
      </div>
      <div className="hidden md:grid gap-5 text-neutral-600">
        <p>
          At The Source of Hope, we’re not just another nonprofit—we’re a
          movement dedicated to creating{" "}
          <Bold>lasting, sustainable change</Bold>. Our mission goes beyond
          temporary fixes. We focus on{" "}
          <Bold>
            empowering individuals with skills, education, and opportunities
          </Bold>{" "}
          that transform their lives and communities for generations to come.
        </p>
        <p>
          Think of us as <Bold>five nonprofits in one</Bold>—a united force for
          holistic health and wellness, outdoor education and survival skills,
          entrepreneurship and workforce development, community service, and
          academic mentorship.
        </p>
        <Blockquote className="border-accent-600 text-balance w-1/2">
          "Give a man a fish, and you feed him for a day. Teach a man to fish,
          and you feed him for a lifetime."
        </Blockquote>
        <p>
          By equipping individuals with practical tools and real-world
          experience, we ensure that every dollar invested becomes a ripple of
          impact—
          <Bold>
            creating independent leaders, stronger families, and thriving
            communities.
          </Bold>{" "}
          From nourishing the body to uplifting the spirit, we believe that true
          hope is sustainable when it’s shared.
        </p>
        <p>
          That’s our guiding principle—
          <Bold>
            <Emphasis>empower</Emphasis>, <Emphasis>educate</Emphasis>, and{" "}
            <Emphasis>elevate</Emphasis>.
          </Bold>
        </p>
      </div>
      <div className="grid gap-3 md:hidden text-neutral-600">
        <p>
          At The Source of Hope, we’re more than a nonprofit. We’re a movement
          for lasting change. Our mission is to empower through skills,
          education, and opportunity that transform lives for generations.
        </p>
        <p>
          <Bold>We’re like five nonprofits in one</Bold>, uniting health and
          wellness, outdoor education, entrepreneurship, community service, and
          mentorship.
        </p>
        <p className="pl-3 py-0 border-l-4 border-accent-600 text-balance">
          "Teach a man to fish, and you feed him for a lifetime."
        </p>
        <p>
          Every effort creates stronger families and thriving communities. True{" "}
          <Bold>hope lasts when it’s shared</Bold>.
        </p>
        <p>
          <Bold>
            Together we <Emphasis>empower</Emphasis>,
            <Emphasis>educate</Emphasis>, and <Emphasis>elevate</Emphasis>.
          </Bold>
        </p>
      </div>
    </PageSection>
  );
}

function MajorEventCard({ post }) {
  const [image, setImage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchContent(`/media?parent=${post.id}`)
      .then((data) => {
        setImage(data[0].guid.rendered);
      })
      .catch(() => setImage(""));
  }, []);

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        bg-white shadow-md
        transition-all duration-500
      ">
      <div className="relative aspect-[16/9]">
        <img
          src={image || "/core/placeholder.png"}
          alt={post.acf?.title}
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
        <div className="pt-2">
          <AnchorButton href={post.acf?.event_page.url} text="Register Now" />
        </div>
      </div>
    </div>
  );
}

function CarouselCard({ post }) {
  const [image, setImage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchContent(`/media?parent=${post.id}`)
      .then((data) => {
        setImage(data[0].guid.rendered);
      })
      .catch(() => setImage(""));
  }, []);

  return (
    <div
      className="
        group relative shrink-0
        flex-[0_0_100%]
        md:flex-[0_0_48%]
        lg:flex-[0_0_32%]
        bg-white rounded-2xl overflow-hidden
        shadow-md
      ">
      <div className="relative aspect-video">
        <img
          src={image || "/core/placeholder.png"}
          alt={post.acf?.title}
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
        <div className="pt-2">
          <AnchorButton href={post.acf?.event_page.url} text="Register Now" />
        </div>
      </div>
    </div>
  );
}
