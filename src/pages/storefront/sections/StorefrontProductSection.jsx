import { useEffect, useState } from "react";
import {
  fetchContent,
  getFeaturedImage,
  getResponsiveImage,
} from "../../../cms";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";

const overlayRoot = document.getElementById("root");

export default function StorefrontProductSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    fetchContent("/products&_embed")
      .then((data) => setPosts(data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchPosts);
    } else {
      setTimeout(fetchPosts, 1);
    }
  }, []);

  return (
    <section className="w-full md:justify-items-left items-center grid px-5 lg:px-35 pt-25 h-full">
      <div className="mb-10 flex flex-col max-w-2xl gap-5">
        <div className="grid gap-1 justify-self-start justify-start">
          <Title>Storefront</Title>
          <Heading>Shop With Purpose</Heading>
        </div>
        <p className="text-neutral-600">
          Every purchase directly supports The Source of Hope’s mission: feeding
          families, empowering students, and strengthening communities.
        </p>
      </div>
      <div className="min-h-80 flex items-center justify-center">
        {loading && (
          <div className="text-center text-neutral-400">Loading products…</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center text-neutral-400">
            No products available at the moment.
          </div>
        )}
        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ProductCard key={post.id} post={post} />
          ))}
        </article>
      </div>
    </section>
  );
}

function ProductCard({ post }) {
  const [loaded, setLoaded] = useState(false);
  const image = getFeaturedImage(post);
  const src = getResponsiveImage(image, { width: 420 });

  /*
  TODO: Going to use createPortal here soon
  */

  return (
    <a
      href={`https://cms.thesourceofhope.org/wp-json/wp/v2/products/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={src || `/${ASSET_VERSION}/core/placeholder.webp`}
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
        <h2 className="line-clamp-2 font-semibold leading-tight transition-colors duration-300">
          {post.acf?.title}
        </h2>
        <p>{post.acf?.price}</p>
        <a
          href={post.acf?.location}
          target="_blank"
          rel="noopener noreferrer"
          className={`!no-underline text-sm md:text-md group inline-flex w-full justify-between items-center gap-1 focus:outline-none`}>
          <span>Add To Cart</span>
          <ArrowUpRightIcon
            className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </a>
  );
}
