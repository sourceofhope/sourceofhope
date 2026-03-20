"use client";

import { useState, useEffect } from "react";
import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import ExpressiveAnchor from "@/components/ui/ExpressiveAnchor";
import PageSection from "@/components/ui/PageSection";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const activePost = posts[activeIndex];

  useEffect(() => {
    // Simulate fetching publications
    // In a real scenario, this would fetch from Sanity CMS
    const fetchPosts = async () => {
      try {
        // Mock data for now - replace with actual Sanity query
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
        setActiveIndex(0);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => fetchPosts());
    } else {
      setTimeout(fetchPosts, 1);
    }

    // Auto-rotate carousel every 5 seconds
    if (!loading && posts.length > 0) {
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % posts.length);
        setImageLoaded(false);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [loading, posts.length]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <PageSection className="py-15 px-5 lg:px-35 w-full">
      <div className="grid grid-flow-row w-full md:grid-cols-2 items-center gap-5 text-sm md:text-md lg:text-lg min-h-90">
        {/* Left side: Text and CTA */}
        <article className="grid gap-5 justify-items-start">
          <Title className="text-2xl md:text-3xl">
            <Emphasis>LATEST UPDATES</Emphasis>
          </Title>
          <p className="text-left text-balance text-neutral-700 dark:text-neutral-900">
            {!loading && activePost?.summary
              ? activePost.summary
              : "Stay connected with the latest stories, programs, and community impact from The Source of Hope."}
          </p>
          <div className="w-fit text-neutral-600 dark:text-neutral-400">
            {!loading && posts.length > 0 && activePost?.url && (
              <ExpressiveAnchor href={activePost.url} className="font-semibold">
                Read more {activePost.title}
              </ExpressiveAnchor>
            )}
            {(loading || posts.length === 0) && (
              <ExpressiveLink to="/media" className="font-semibold">
                Read Publications
              </ExpressiveLink>
            )}
          </div>
        </article>

        {/* Right side: Carousel */}
        <div
          className={`min-h-64 flex items-center justify-center ${
            loading ? "opacity-0" : "opacity-100 transition-opacity duration-750"
          }`}
        >
          {!loading && posts.length === 0 && (
            <p className="w-full text-center text-neutral-500">
              No updates to display
            </p>
          )}
          {!loading && posts.length > 0 && (
            <div className="w-full">
              {/* Carousel Image */}
              <div className="relative h-72 md:h-80 w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePost?.imageUrl || `/${ASSET_VERSION}/core/placeholder.webp`}
                  alt={activePost?.title || "Publication"}
                  className={`${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  } w-full h-full object-cover transition-opacity duration-300`}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                  decoding="async"
                />
                {/* Date Badge */}
                <div className="absolute top-4 left-4 z-10 bg-accent-600 rounded-full px-3 py-1 text-xs font-semibold text-neutral-50">
                  {formatDate(activePost?.date)}
                </div>
              </div>

              {/* Progress Indicators and Controls */}
              <div className="flex gap-2 justify-center mt-4">
                {posts.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "bg-accent-600 w-8"
                        : "bg-neutral-300 w-2 hover:bg-accent-400"
                    }`}
                    onClick={() => {
                      setActiveIndex(index);
                      setImageLoaded(false);
                    }}
                    aria-label={`Go to publication ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageSection>
  );
}
