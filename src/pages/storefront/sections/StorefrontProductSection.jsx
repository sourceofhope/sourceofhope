import { useEffect, useState } from "react";
import {
  fetchContent,
  getFeaturedImage,
  getResponsiveImage,
} from "../../../cms";
import { ASSET_VERSION } from "../../../routes";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import { useCartActions } from "../../../context/StoreCartContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import Overlay from "../../../components/ui/Overlay";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import Takeover from "../../../components/ui/Takeover";

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
    <section className="w-full px-5 lg:px-35 pt-25 mb-10">
      <div className="mb-10 flex flex-col gap-5 max-w-2xl">
        <div className="grid gap-1">
          <Title>Storefront</Title>
          <Heading>Shop With Purpose</Heading>
        </div>
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
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCartActions();
  const image = getFeaturedImage(post);
  const src = getResponsiveImage(image, { width: 420 });

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const priceValue = parseFloat(post.acf?.price || 0);

    const cartItem = {
      id: post.id,
      slug: post.slug,
      title: post.acf?.title || "Untitled Product",
      price: priceValue,
      quantity: 1,
      image: src || `/${ASSET_VERSION}/core/placeholder.webp`,
    };

    if (post.acf?.size) {
      cartItem.size = post.acf.size;
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);

    addToCart(cartItem);
  };

  return (
    <>
      <Link
        to={`product/${post.slug}`}
        className="group relative hidden md:flex flex-col !no-underline overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
        </div>
        <div
          className="relative flex flex-col group gap-2 p-5 text-neutral-50"
          onClick={handleAddToCart}>
          <Heading className="text-neutral-50">{post.acf?.title}</Heading>
          <p className="text-sm md:text-md">
            ${parseFloat(post.acf?.price).toFixed(2)}
          </p>
          <button className="text-sm md:text-md inline-flex h-fit w-full items-center gap-3 font-bold">
            Add To Cart
            <PlusIcon className="opacity-0 group-hover:opacity-100 duration-300 transition-opacity aspect-square w-[1em]" />
          </button>
        </div>
      </Link>
      <div
        onClick={() => setActive(true)}
        className="group relative md:hidden flex flex-col !no-underline overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
        <div
          onClick={handleAddToCart}
          className="relative aspect-square overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-2 p-5 text-neutral-50">
          <Heading className="text-neutral-50">{post.acf?.title}</Heading>
          <p className="text-sm md:text-md">${post.acf?.price}</p>
          <span className="text-sm md:text-md inline-flex w-full justify-between items-center gap-1 font-semibold">
            <span>Preview Product</span>
          </span>
        </div>
      </div>
      <Takeover
        className="bg-neutral-400 rounded-2xl px-5 py-3 w-fit h-fit text-neutral-600 flex justify-between gap-3 items-center"
        active={added}
        setActive={setAdded}>
        <p>Added To Cart</p>
        <CheckIcon className="size-5 shrink-0" />
      </Takeover>
      <Overlay active={active} setActive={setActive}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-900">
              {post.acf?.title}
            </h2>

            <button
              onClick={() => setActive(false)}
              className="rounded-full p-2 hover:bg-neutral-200 transition">
              <XMarkIcon className="size-5 text-neutral-600" />
            </button>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-base font-semibold text-primary-800">
              ${parseFloat(post.acf?.price).toFixed(2)}
            </p>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {post.acf?.shortdescription}
          </p>
          <div className="flex justify-end w-fit">
            {" "}
            <ExpressiveLink
              ariaLabel={`Learn more about ${post.acf?.title} at the source of hope`}
              to={`product/${post.slug}`}
              className="font-semibold text-accent-700 hover:text-accent-800 transition-colors duration-750">
              {" "}
              Shop '{post.acf?.title}'{" "}
            </ExpressiveLink>{" "}
          </div>
        </div>
      </Overlay>
    </>
  );
}
