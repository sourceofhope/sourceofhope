"use client";

import { useState } from "react";
import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import Carousel from "@/components/ui/Carousel";
import Blockquote from "@/components/ui/Blockquote";
import HighlightedText from "@/components/ui/HighlightedText";

export interface MediaNewsletterPost {
  id: number;
  acf?: {
    title: string;
    url: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      alt_text: string;
      source_url: string;
    }>;
  };
}

export default function MediaNewsletterSection({
  newsletters,
}: {
  newsletters: MediaNewsletterPost[];
}) {
  return (
    <PageSection className="grid gap-5 relative m-0 text-sm md:text-md lg:text-lg">
      <Title>Our Newsletter</Title>
      <article className="flex flex-col gap-5">
        <Heading>Stay Connected</Heading>
        <p>
          Join our growing community by subscribing to The Source of Hope&apos;s
          newsletters! Receive inspiring stories, the latest updates, and
          exclusive news directly in your inbox.
        </p>
        <Blockquote className="border-accent-500 text-balance">
          Our newsletter is <HighlightedText>completely free</HighlightedText>
          —no spam, no pressure—just purpose-driven updates, stories of impact,
          and opportunities to get involved.
        </Blockquote>
        <p>
          Stay informed and be a part of the change we&apos;re creating. By
          subscribing, you&apos;ll be the first to know about our upcoming
          events, volunteer opportunities, and how you can make a difference in
          the lives of those we serve.
        </p>
      </article>
      <article className="bg-neutral-50 rounded-2xl shadow-sm p-5 grid gap-2">
        <Heading className="border-b-2 border-neutral-300 pb-2">
          SUBSCRIBE TODAY
        </Heading>
        <div className="grid gap-3">
          <div className="grid gap-5 md:grid-cols-[2fr_7fr]">
            <span className="font-medium">Inspiring Stories</span>
            <span className="text-neutral-600">
              Learn about the real impact we&apos;re making in the community
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
        <p>
          Stay connected with monthly and quarterly updates on The Source of
          Hope&apos;s projects, events, and stories of resilience from the lives
          we&apos;ve touched.
        </p>
        <p>
          You&apos;ll also receive opportunities to support our mission through
          donations and volunteering. By signing up, you join a compassionate
          community dedicated to creating hope and lasting change together.
        </p>
        <Heading>Latest Newsletters</Heading>
        <div className="min-h-60 flex items-center opacity-100 transition-opacity duration-750">
          {newsletters.length === 0 && (
            <p className="text-center w-full text-gray-500 py-10">
              No newsletters to display
            </p>
          )}
          {newsletters.length > 0 && (
            <Carousel
              auto={true}
              showProgress
              itemsPerView={{ base: 1, md: 2, lg: 3 }}>
              {newsletters.map((post) => (
                <CarouselCard key={post.id} post={post} />
              ))}
            </Carousel>
          )}
        </div>
      </article>
    </PageSection>
  );
}

function CarouselCard({ post }: { post: MediaNewsletterPost }) {
  const [loaded, setLoaded] = useState(false);
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const src = image?.source_url;

  return (
    <a
      href={post.acf?.url}
      className="group h-full relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={src || "/v2/core/placeholder.webp"}
          alt={image?.alt_text || ""}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="relative flex flex-col gap-2 p-5 text-neutral-50">
        <h2 className="line-clamp-1 text-md font-semibold leading-tight transition-colors duration-300">
          {post.acf?.title}
        </h2>
        <div className="w-fit text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
          Read newsletter
        </div>
      </div>
    </a>
  );
}
