import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchContent, getFeaturedImage, getResponsiveImage } from "../../cms";
import { CANONICAL, CANONICAL_URL } from "../../routes";
import Title from "../../components/ui/text/Title";
import { CheckIcon, HeartIcon, PlusIcon } from "@heroicons/react/20/solid";
import { AnchorButton, LinkButton } from "../../components/ui/Button";
import Heading from "../../components/ui/text/Heading";
import Cart from "./Cart";
import { useCartActions } from "../../context/StoreCartContext";
import Takeover from "../../components/ui/Takeover";
import Loader from "../../components/structure/Loader";
import { useHeaderContext } from "../../context/HeaderContext";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { productSlug } = useParams();
  const { addToCart } = useCartActions();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      url: "#",
    };

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);

    addToCart(cartItem);
  };

  const { setIsBlocking } = useHeaderContext();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchContent(`/product?slug=${productSlug}&_embed`);

        if (!data.length) throw new Error("Product not found");
        const post = data[0];
        setProduct({
          id: post.id,
          title: post.acf?.title || "Untitled Product",
          shortDescription: post.acf?.shortdescription,
          longDescription: post.acf?.longdescription,
          price: parseFloat(post.acf?.price),
          impact: post.acf?.impact,
          image:
            getResponsiveImage(getFeaturedImage(post), { width: 900 }) ??
            "/v2/core/placeholder.webp",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadProduct();
  }, [productSlug]);

  useEffect(() => {
    if (!loading && product?.title) {
      document.title = `${product.title} | Products`;
    }
  }, [loading, product]);

  return (
    <>
      <Helmet key={product?.id || "loading"}>
        <title>
          {loading
            ? "Loading"
            : `${product?.title || "Missing Product"} | Products`}
        </title>

        <meta
          name="description"
          content="Shop The Source of Hope Storefront and support our mission — every purchase helps provide meals, education, and holistic wellness services to families and communities across North Texas."
        />

        <link
          rel="canonical"
          href={`${CANONICAL_URL.storefront.product}/${productSlug}`}
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${CANONICAL_URL.storefront.product}/${productSlug}`}
        />
        <meta
          property="og:title"
          content="Shop With Purpose | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Every purchase from The Source of Hope Storefront directly funds programs that feed families, empower students, and strengthen communities."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={`${CANONICAL_URL.storefront.product}/${productSlug}`}
        />
        <meta
          name="twitter:title"
          content="Shop With Purpose | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Support community impact through meaningful purchases — shop with purpose at The Source of Hope."
        />
      </Helmet>
      <Cart />
      <Takeover
        className="bg-neutral-400 rounded-2xl px-5 py-3 w-fit h-fit text-neutral-600 flex justify-between gap-3 items-center"
        active={added}
        setActive={setAdded}>
        <p>Added To Cart</p>
        <CheckIcon className="size-5 shrink-0" />
      </Takeover>
      {loading && <Loader />}
      {!loading && !product && (
        <section className="w-full min-h-screen flex flex-col py-5 items-center justify-center text-center px-5">
          <div className="max-w-xl">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center shadow-sm">
              <HeartIcon className="w-10 h-10 text-accent-500" />
            </div>

            <Title>We Can't Find That Product</Title>
            <p className="text-gray-700 leading-relaxed mb-10">
              We couldn't find the product you were looking for, but every visit
              here still supports our mission.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <LinkButton
                to={CANONICAL.storefront.absolute}
                text="Browse our Store"
              />

              <AnchorButton
                href="https://donate.stripe.com/8wM5kHal16fC4so8ww"
                text="Make a Donation"
              />
            </div>
          </div>
        </section>
      )}
      {!loading && product && (
        <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-5 lg:px-35 pt-25">
          <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full max-w-2xl">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <img
                  src={product?.image}
                  alt={product?.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 self-start">
            <Title>{product?.title}</Title>
            <Heading>${parseFloat(product?.price).toFixed(2)}</Heading>
            <p className="text-gray-700 text-sm md:text-md">
              {product?.shortDescription}
            </p>
            <div className="flex flex-col md:flex-row gap-5 mt-5">
              <button 
                onClick={handleAddToCart}
                aria-label="Add To Cart"
                className="clsAddToCart group inline-flex items-center
        rounded-2xl px-10 py-5
        bg-emerald-500 hover:bg-emerald-600
        transition-all duration-700 w-full font-semibold text-neutral-50">
                <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
                  <span>Add To Cart</span>
                  <PlusIcon className="w-[1em] h-[1em] transition-transform duration-500" />
                </span>
              </button>
              <AnchorButton
                full
                href="https://donate.stripe.com/8wM5kHal16fC4so8ww"
                text="Make a Donation"
              />
            </div>
            <div className="mt-5 text-gray-800 leading-relaxed text-sm md:text-md">
              {product?.longDescription}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="p-5 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm space-y-3">
              <h3 className="text-lg font-semibold text-primary-900">
                Your Impact
              </h3>
              <p className="text-sm md:text-md text-gray-800 leading-relaxed">
                {product?.impact}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
