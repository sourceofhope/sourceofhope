import { Helmet } from "react-helmet";
import { useSetHeaderBlocking } from "../../components/structure/Header";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchContent } from "../../cms";
import { CANONICAL_URL } from "../../routes";
import Title from "../../components/ui/text/Title";
import { AnchorButton, LinkButton } from "../../components/ui/Button";
import { ArrowUpRightIcon, PlusIcon } from "@heroicons/react/20/solid";

export default function ProductPage() {
  const { slug } = useParams();

  fetchContent();

  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);

  // Mock product for now (replace with CMS / API later)
  const product = {
    title: "Wellness Detox Program",
    price: "$299",
    shortDescription:
      "A 7-day guided detox experience designed to reset your body and mind.",
    longDescription:
      "This program includes personalized wellness planning, nutritional guidance, holistic treatments, and daily check-ins. Every purchase helps provide wellness services to families in need through The Source of Hope.",
    impact:
      "Your purchase helps provide meals, education, and holistic care to underserved families across North Texas.",
    image: "/v2/core/placeholder.webp",
  };

  return (
    <>
      <Helmet>
        <title> {product.title} | The Source of Hope</title>

        <meta
          name="description"
          content="Shop The Source of Hope Storefront and support our mission — every purchase helps provide meals, education, and holistic wellness services to families and communities across North Texas."
        />

        <link rel="canonical" href={CANONICAL_URL.storefront} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.storefront} />
        <meta
          property="og:title"
          content="Shop With Purpose | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Every purchase from The Source of Hope Storefront directly funds programs that feed families, empower students, and strengthen communities."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.storefront} />
        <meta
          name="twitter:title"
          content="Shop With Purpose | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Support community impact through meaningful purchases — shop with purpose at The Source of Hope."
        />
      </Helmet>
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 px-5 lg:px-35 pt-25 pb-25">
        <div className="w-full flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-w-xl rounded-2xl shadow-lg object-cover"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Title>{product.title}</Title>
          <p className="text-xl text-gray-700">{product.shortDescription}</p>
          <div className="text-3xl font-semibold text-primary-800"></div>
          <div className="flex flex-wrap gap-5 mt-5">
            <button className="flex justify-center w-fit rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 transition-all duration-700 font-semibold text-neutral-50">
              <span className="inline-flex w-full justify-between items-center gap-1 text-sm md:text-md">
                Add To Cart
              </span>
            </button>
            <a
              href="https://donate.stripe.com/8wM5kHal16fC4so8ww"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Donate Today"
              className="!no-underline group flex justify-center w-fit rounded-2xl px-10 py-5 border-4 border-accent-500 hover:border-accent-600 transition-colors duration-700 font-semibold text-neutral-50">
              <span className="inline-flex w-full justify-between items-center gap-1 text-sm md:text-md text-accent-500 hover:text-accent-600 transition-colors duration-700">
                Donate Instead
                <ArrowUpRightIcon
                  className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                  focusable="false"
                />
              </span>
            </a>
          </div>
          <div className="mt-5 text-gray-800 leading-relaxed">
            {product.longDescription}
          </div>
          <div className="mt-5 p-5 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Your Impact</h3>
            <p>{product.impact}</p>
          </div>
        </div>
      </section>
    </>
  );
}
