"use client";

import { useEffect, useState } from "react";
import Title from "@/components/ui/Title";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import ExpressiveAnchor from "@/components/ui/ExpressiveAnchor";
import PageSection from "@/components/ui/PageSection";
import Carousel from "@/components/ui/Carousel";
import HighlightedText from "../ui/HighlightedText";

const ASSET_VERSION = "v2";

interface Publication {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  imageUrl?: string;
  date?: string;
}

export default function HomePublicationsSection() {
  const [posts, setPosts] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Replace this with your real CMS query
        const mockPosts: Publication[] = [
          {
            id: "1",
            title: "Community Health Initiative",
            summary:
              "Discover how our latest health and wellness programs are making a difference in the DFW community.",
            url: "/media",
            imageUrl: `/${ASSET_VERSION}/core/TSOH-Poster.webp`,
            date: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Education Hope Program",
            summary:
              "Learn about our tutoring and mentoring initiatives helping students succeed academically.",
            url: "/media",
            imageUrl: `/${ASSET_VERSION}/core/TSOH-Service.webp`,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            title: "Volunteer Spotlight",
            summary:
              "Meet the amazing volunteers who dedicate their time to serving our community.",
            url: "/media",
            imageUrl: `/${ASSET_VERSION}/core/TSOH-Family.webp`,
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "4",
            title: "Podcast Series Launch",
            summary:
              "Tune in to our new podcast series featuring stories from community members and leaders.",
            url: "/media/podcast",
            imageUrl: `/${ASSET_VERSION}/core/TSOH-Poster.webp`,
            date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "5",
            title: "Press Coverage",
            summary:
              "See what local media is saying about The Source of Hope's impact.",
            url: "/media/press",
            imageUrl: `/${ASSET_VERSION}/core/TSOH-Service.webp`,
            date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];

        setPosts(mockPosts);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <PageSection className="py-15 px-5 md:pb-0 lg:px-15 w-full">
      <div className="grid grid-flow-row md:grid-flow-col gap-8 items-center">
        <div className="flex flex-col gap-4 max-w-2xl">
          <HighlightedText className="w-fit self-center md:self-auto">
            <Title>LATEST UPDATES</Title>
          </HighlightedText>

          <p className="text-neutral-700 dark:text-neutral-900 text-balance">
            Stay connected with the latest stories, programs, and community
            impact from The Source of Hope.
          </p>

          <div className="w-fit">
            <ExpressiveLink to="/media" className="font-semibold">
              View All Publications
            </ExpressiveLink>
          </div>
        </div>

        {loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl bg-neutral-100 animate-pulse">
                <div className="h-64 bg-neutral-200" />
                <div className="flex flex-col gap-3 p-6">
                  <div className="h-4 w-24 rounded bg-neutral-200" />
                  <div className="h-6 w-3/4 rounded bg-neutral-200" />
                  <div className="h-4 w-full rounded bg-neutral-200" />
                  <div className="h-4 w-5/6 rounded bg-neutral-200" />
                  <div className="h-5 w-32 rounded bg-neutral-200 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-center text-neutral-500">No updates to display</p>
        )}

        {!loading && posts.length > 0 && (
          <Carousel auto showProgress itemsPerView={{ base: 1, md: 1, lg: 1 }}>
            {posts.map((post) => (
              <PublicationCard key={post.id} post={post} />
            ))}
          </Carousel>
        )}
      </div>
    </PageSection>
  );
}

function PublicationCard({ post }: { post: Publication }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition duration-300">
      <div className="relative h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl || `/${ASSET_VERSION}/core/placeholder.webp`}
          alt={post.title}
          className="h-full w-full object-cover transition duration-500"
          loading="lazy"
          decoding="async"
        />

        {post.date && (
          <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {formatDate(post.date)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="text-lg font-bold text-neutral-900">{post.title}</h3>

        <p className="line-clamp-3 text-sm leading-6 text-neutral-700">
          {post.summary ||
            "Stay connected with the latest stories, programs, and community impact from The Source of Hope."}
        </p>

        <div className="mt-auto">
          {post.url ? (
            <ExpressiveAnchor href={post.url} className="font-semibold">
              Read more
            </ExpressiveAnchor>
          ) : (
            <ExpressiveLink to="/media" className="font-semibold">
              Read more
            </ExpressiveLink>
          )}
        </div>
      </div>
    </article>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.toLocaleString("default", {
    month: "short",
  })} ${date.getDate()}, ${date.getFullYear()}`;
}
