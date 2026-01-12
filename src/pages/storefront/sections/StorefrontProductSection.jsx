import { useEffect, useState } from "react";
import {
  fetchContent,
  getFeaturedImage,
  getResponsiveImage,
} from "../../../cms";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import { ASSET_VERSION } from "../../../routes";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import postcssPluginWarning from "tailwindcss";
import { Link, useLocation } from "react-router-dom";

const overlayRoot = document.getElementById("root");

export default function StorefrontProductSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    fetchContent("/product?per_page=100&_embed")
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
    <section className="w-full px-5 lg:px-35 pt-25">
      <div className="mb-10 flex flex-col gap-5 max-w-2xl">
        <div className="grid gap-1">
          <Title>Storefront</Title>
          <Heading>Shop With Purpose</Heading>
        </div>
        <p className="text-neutral-600">
          Every purchase directly supports The Source of Hope’s mission: feeding
          families, empowering students, and strengthening communities.
        </p>
      </div>
      <div className="w-full min-h-80 flex items-center">
        {loading && (
          <div className="w-full text-center text-neutral-400">
            Loading products
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="w-full text-center text-neutral-400">
            No products available
          </div>
        )}

        {!loading && posts.length > 0 && (
          <article className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <ProductCard key={post.id} post={post} />
            ))}
          </article>
        )}
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

  const location = useLocation();

  return (
    <Link
      to={`product/${post.slug}`}
      className="group relative flex flex-col !no-underline overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden">
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
        <Heading className="text-neutral-50">{post.acf?.title}</Heading>
        <p className="text-sm md:text-md">${post.acf?.price}</p>
        <a
          href={post.acf?.location}
          target="_blank"
          rel="noopener noreferrer"
          className={`!no-underline text-sm md:text-md group inline-flex w-full justify-between items-center gap-1 focus:outline-none`}>
          <span>Add To Cart</span>
        </a>
      </div>
    </Link>
  );
}
