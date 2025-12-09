import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";
import Carousel from "../../../components/ui/Carousel";
import { useState } from "react";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function MediaNewsletterSection() {
  return (
    <PageSection className="grid gap-5 relative m-0 text-sm md:text-md lg:text-lg">
      <Title>Our Newsletter</Title>
      <article className="flex flex-col gap-5">
        <Heading>Stay Connected</Heading>
        <p>
          Join our growing community by subscribing to The Source of Hope’s
          newsletters! Receive inspiring stories, the latest updates, and
          exclusive news directly in your inbox. Stay informed and be a part of
          the change we’re creating. By subscribing, you’ll be the first to know
          about our upcoming events, volunteer opportunities, and how you can
          make a difference in the lives of those we serve.
        </p>
      </article>
      <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
        <Heading className=" border-b-2 border-neutral-300 pb-2">
          SUBSCRIBE TODAY
        </Heading>
        <div className="grid gap-3">
          <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
            <span className="font-medium">Inspiring Stories</span>
            <span className="text-neutral-600">
              Learn about the real impact we’re making in the community
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
            <span className="font-medium">Exclusive Updates</span>
            <span className="text-neutral-600">
              Get first access to event details, fundraising opportunities, and
              more
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
            <span className="font-medium">Ways to Get Involved</span>
            <span className="text-neutral-600">
              Discover how you can volunteer, donate, or partner with us in our
              mission
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
            <span className="font-medium">Stay Informed</span>
            <span className="text-neutral-600">
              Receive regular newsletters with important updates about our
              programs, initiatives, and success stories
            </span>
          </div>
        </div>
      </article>
      <article className="flex flex-col gap-5">
        <Heading>2025 Newsletters</Heading>
        <p>
          Stay connected with monthly and quarterly updates on The Source of
          Hope's projects, events, and stories of resilience from the lives
          we've touched. You'll also receive opportunities to support our
          mission through donations and volunteering. By signing up, you join a
          compassionate community dedicated to creating hope and lasting change
          together.
        </p>
        <Carousel>
          <CarouselCard
            title="January 2025"
            caption="Quote Here"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
          <CarouselCard
            title="February 2025"
            caption="Quote Here"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
          <CarouselCard
            title="March 2025"
            caption="Quote Here"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            href=""
          />
        </Carousel>
      </article>
    </PageSection>
  );
}

function CarouselCard({ src, href, title, caption }) {
  return (
    <a
      href={href}
      className="
    relative h-full
    shrink-0
    flex-[0_0_calc(100%)] 
    md:flex-[0_0_calc(50%-0.625rem)] 
    lg:flex-[0_0_calc(33.333%-0.833rem)]
    group overflow-hidden rounded-2xl text-accent-background aspect-square border-4 border-neutral-400
  ">
      <img
        src={src}
        alt={caption}
        className="inset-0 w-full h-full object-cover transition-transform brightness-[.8] contrast-[1.1]"
      />
      <div className="absolute bottom-0 left-0 w-full p-5 rounded-b-2xl flex flex-col justify-start bg-neutral-50">
        <h2 className="md:line-clamp-1 text-md duration-750 transition-all font-semibold text-center text-neutral-950">
          {title}
        </h2>
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
