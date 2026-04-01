import { Helmet } from "react-helmet-async";
import StorefrontProductSection from "./sections/StorefrontProductSection";
import StorefrontFooterSection from "./sections/StorefrontFooterSection";
import { useEffect } from "react";
import { CANONICAL_URL } from "../../routes";
import Cart from "./Cart";
import { useHeaderContext } from "../../context/HeaderContext";

export default function StorefrontPage() {
  const { setIsBlocking } = useHeaderContext();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);

  return (
    <>
      <Helmet>
        <title>Shop With Purpose | The Source of Hope</title>

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
      <Cart />
      <StorefrontProductSection />
      <StorefrontFooterSection />
    </>
  );
}
