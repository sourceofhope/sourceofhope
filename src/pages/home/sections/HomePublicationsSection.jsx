import { useState, useEffect } from "react";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";
import { HomeSection } from "../HomePage";

import Carousel from "../../../components/ui/Carousel";
import Title from "../../../components/ui/text/Title";
import { fetchContent, getResponsiveImage } from "../../../cms";
import { ASSET_VERSION, CANONICAL_URL } from "../../../routes";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";

export default function HomePublicationsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  let activePost = posts[activeIndex];

  const fetchPosts = () => {
    fetchContent("/publication?per_page=5&_embed")
      .then((data) => {
        setPosts(data);
        setActiveIndex(0);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchPosts);
    } else {
      setTimeout(run, 1);
    }
  }, []);

  return (
    <HomeSection>
      <div className="grid grid-flow-row w-full md:grid-cols-[1fr_1fr] items-center gap-5 text-sm md:text-md lg:text-lg min-h-90">
        <article className="grid gap-5 justify-items-start">
          <HighlightedText className="w-fit self-center md:self-auto">
            <Title>LATEST UPDATES</Title>
          </HighlightedText>
          <p className="text-left text-balance">
            {!loading && activePost?.acf?.summary
              ? activePost.acf.summary
              : "Stay connected with the latest stories, programs, and community impact from The Source of Hope."}
          </p>
          <div className="w-fit text-neutral-600">
            <ExpressiveAnchor
              className="font-semibold"
              ariaLabel="See more of The Source of Hope's publications"
              href={
                !loading && posts.length > 0
                  ? activePost?.acf?.url
                  : CANONICAL_URL.media
              }>
              {!loading && posts.length > 0
                ? `Read more ${activePost.acf?.title}`
                : "Read publications"}
            </ExpressiveAnchor>
          </div>
        </article>
        <div
          className={`min-h-40 flex items-center ${
            loading
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-750"
          }`}>
          {!loading && posts.length === 0 && (
            <p className="w-full text-center text-gray-500">
              No updates to display
            </p>
          )}
          {!loading && posts.length > 0 && (
            <Carousel
              auto
              showProgress
              className="h-full border-t-2 md:border-t-0 md:border-l-2 w-full py-5 md:pl-10 border-neutral-400"
              activeIndex={activeIndex}
              onChange={setActiveIndex}>
              {posts.map((post) => (
                <CarouselImage
                  key={post.id}
                  id={post.acf?.image}
                  date={new Date(post.acf?.date)}
                />
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </HomeSection>
  );
}

function CarouselImage({ id, date }) {
  const [loaded, setLoaded] = useState(false);
  const image = getFeaturedImage(post);
  const src = getResponsiveImage(image, { width: 720 });

  return (
    <div className="relative h-full w-full">
      <img
        className={`${
          loaded ? "opacity-100" : "opacity-0"
        } w-full h-full z-10 aspect-[16/9] bg-accent-900 rounded-2xl object-center object-cover`}
        src={image?.source_url || `/${ASSET_VERSION}/core/placeholder.webp`}
        alt={image?.alt_text || ""}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        decoding="async"
      />
      <p className="absolute top-2 left-2 z-20 bg-accent-600 rounded-full px-3 py-1 text-sm text-neutral-50 w-fit">
        {date.toLocaleString("default", { month: "short" })} {date.getDay()},{" "}
        {date.getFullYear()}
      </p>
    </div>
  );
}
