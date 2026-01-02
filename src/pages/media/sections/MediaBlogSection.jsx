import { fetchContent } from "../../../cms";
import { AnchorButton } from "../../../components/ui/Button";
import Carousel from "../../../components/ui/Carousel";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import { ASSET_VERSION } from "../../../routes";
import PageSection from "../../PageSection";

import { useState, useEffect } from "react";

export default function MediaBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent("/publication?per_page=10&_embed")
      .then((data) => {
        setPosts(data);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageSection className="grid gap-5 relative m-0 text-sm md:text-base lg:text-lg">
      <Title>Our Blog</Title>
      <div
        className={`min-h-40 flex items-center ${
          loading ? "opacity-0" : "opacity-100 transition-opacity duration-750"
        }`}>
        {!loading && posts.length === 0 && (
          <p className="text-center w-full text-gray-500 py-10">
            No blog posts to display.
          </p>
        )}
        {!loading && posts.length > 0 && (
          <Carousel auto={true} itemsPerView={{ base: 1, md: 2, lg: 3 }}>
            {posts.map((post) => (
              <CarouselCard key={post.id} post={post} />
            ))}
          </Carousel>
        )}
      </div>
    </PageSection>
  );
}

function CarouselCard({ post }) {
  const [loaded, setLoaded] = useState(false);
  const image = getFeaturedImage(post);

  return (
    <div
      className="
        group relative shrink-0
        bg-white rounded-2xl overflow-hidden
        shadow-md
      ">
      <div className="relative aspect-video">
        <img
          src={image?.source_url || `/${ASSET_VERSION}/core/placeholder.webp`}
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
                })
              : "Date TBA"}
          </span>
        </div>
        <p className="text-sm text-neutral-600 line-clamp-3">
          {post.acf?.summary}
        </p>
        <div className="pt-2">
          <AnchorButton href={post.acf?.url} text="Register Now" />
        </div>
      </div>
    </div>
  );
}
