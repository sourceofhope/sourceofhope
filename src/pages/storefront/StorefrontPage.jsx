import { Helmet } from "react-helmet";
import { useSetHeaderBlocking } from "../../components/structure/Header";
import StorefrontProductSection from "./sections/StorefrontProductSection";
import StorefrontFooterSection from "./sections/StorefrontFooterSection";
import { useEffect, useContext, useRef } from "react";
import { CANONICAL_URL } from "../../routes";
import { StoreCartContext, useCartActions } from "../../context/StoreCartContext";

export default function StorefrontPage() {
  const { cart: cartItems } = useContext(StoreCartContext); 
  const { addToCart } = useCartActions();
  const demoItemsAdded = useRef(false);

  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);

  // Add demo items for testing (runs once on mount)
  useEffect(() => {
    if(demoItemsAdded.current) return;


    const demoItems = [
      {
        id: 1,
        name: "Hope T-Shirt",
        price: 25.0,
        quantity: 5,
        size: "M",
        image: "/images/tshirt.jpg",
      },
      {
        id: 2,
        name: "Education Hope Hoodie",
        price: 45.0,
        quantity: 1,
        size: "L",
        image: "/images/hoodie.jpg",
      },
    ];

    // Only add items if cart is empty
    if (cartItems.length === 0) {
      demoItems.forEach((item) => {
        addToCart(item);
      });
      demoItemsAdded.current = true;
    }
  }, []); // Empty dependency array to run only once on mount

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

      <StorefrontProductSection />
      <StorefrontFooterSection />
    </>
  );
}
