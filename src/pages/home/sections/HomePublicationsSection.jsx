import { useState, useEffect } from "react";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";
import { HomeSection } from "../HomePage";

import Carousel from "../../../components/ui/Carousel";
import Title from "../../../components/ui/text/Title";
import { fetchContent } from "../../../api/cms";

export default function HomePublicationsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  let activePost = posts[activeIndex];

  useEffect(() => {
    fetchContent("posts", "&per_page=5")
      .then((data) => {
        setPosts(data);
        setActiveIndex(0);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <HomeSection>
      <div className="grid grid-flow-row w-full md:grid-cols-[1fr_1fr] items-center gap-5 text-sm md:text-md lg:text-lg">
        <article className="grid gap-5 justify-items-start">
          <HighlightedText className="w-fit self-center md:self-auto">
            <Title>LATEST UPDATES</Title>
          </HighlightedText>
          <p className="text-left text-balance">
            {!loading && activePost?.acf?.summary
              ? activePost.acf.summary
              : "Stay connected with the latest stories, programs, and community impact from The Source of Hope."}
          </p>
          <button className="w-fit text-neutral-600">
            <ExpressiveLink className="font-semibold" to="">
              LEARN MORE
            </ExpressiveLink>
          </button>
        </article>
        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No updates to display.
          </p>
        )}

        {!loading && posts.length > 0 && (
          <Carousel
            className="h-full border-t-2 md:border-t-0 md:border-l-2 w-full py-5 md:pl-10 border-neutral-400"
            activeIndex={activeIndex}
            onChange={setActiveIndex}>
            {posts.map((post) => (
              <CarouselImage
                key={post.id}
                src={post.acf?.hero_image?.url}
                alt={post.title.rendered}
                date={new Date(post.acf?.publish_date)}
              />
            ))}
          </Carousel>
        )}
      </div>
    </HomeSection>
  );
}

function CarouselImage({ src, alt, date }) {
  return (
    <div className="relative h-full w-full">
      <img
        className="w-full h-full z-10 aspect-[16/9] bg-accent-900 rounded-2xl object-center object-cover"
        src={src}
        alt={alt}
      />
      <p className="absolute top-2 left-2 z-20 bg-accent-600 rounded-full px-3 py-1 text-sm text-neutral-50 w-fit">
        {date.toLocaleString("default", { month: "short" })} {date.getDay()},{" "}
        {date.getFullYear()}
      </p>
    </div>
  );
}
