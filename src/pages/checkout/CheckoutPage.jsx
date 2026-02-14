import { Helmet } from "react-helmet-async";
import { CANONICAL_URL } from "../../routes";
import { useEffect } from "react";
import { useCartActions } from "../../context/StoreCartContext";
import Title from "../../components/ui/text/Title";
import ExpressCheckoutSection from "./sections/ExpressCheckoutSection";
import { useSetHeaderBlocking } from "../../components/structure/Header";
import Cart from "../storefront/Cart";
import SelfCheckoutSection from "./sections/SelfCheckoutSection";
import CheckoutDetailsSection from "./sections/CheckoutDetailsSection";

export default function CheckoutPage() {
  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);

  const {
    cart,
    getCartCost,
    getTaxCost,
    getProcessingFeeCost,
    getCartTotal,
    getCartItemCount,
    getShippingCost,
    shippingMethod,
  } = useCartActions();

  const subtotal = getCartCost();
  const shipping = getShippingCost();
  const tax = getTaxCost();
  const processingFee = getProcessingFeeCost();
  const total = getCartTotal();

  return (
    <>
      <Helmet>
        <title>Shopping Cart | The Source of Hope</title>
        <meta
          name="description"
          content="The Source of Hope is a nonprofit organization providing food, education, and holistic wellness to individuals and families across the DFW area."
        />
        <link rel="canonical" href={CANONICAL_URL.storefront.checkout} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.storefront.checkout} />
        <meta property="og:title" content="Checkout | The Source of Hope" />
        <meta
          property="og:description"
          content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.storefront.checkout} />
        <meta name="twitter:title" content="Checkout | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
        />
      </Helmet>
      <Cart />
      {cart.length === 0 ? (
        <section className="w-full min-h-screen flex flex-col py-5 items-center justify-center text-center px-5">
          <div className="text-center py-12">
            <Title>Your Cart is Empty</Title>
            <p className="text-neutral-600 mb-6">
              Add some items to your cart to checkout.
            </p>
            <a
              href="/store"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-2xl transition-colors">
              Continue Shopping
            </a>
          </div>
        </section>
      ) : (
        <div className="min-h-screen bg-neutral-50 pt-30 p-5 md:px-10 lg:px-15">
          {/* 3-Column Layout: Left (Express) | Center (Checkout Form) | Right (Order Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10">
            {/* Left Column: Express Checkout - 25% */}
            <div className="lg:col-span-3 space-y-6">
              <ExpressCheckoutSection
                total={total}
                items={cart}
                processingFee={processingFee}
                shippingMethod={shippingMethod}
                shippingCost={shipping}
                taxAmount={tax}
              />
            </div>

            {/* Center Column: Main Checkout Form - 50% */}
            <div className="lg:col-span-6 space-y-6">
              <SelfCheckoutSection total={total} cart={cart} taxAmount={tax} />
            </div>

            {/* Right Column: Order Summary - 25% */}
            <div className="lg:col-span-3 space-y-6">
              <CheckoutDetailsSection
                cart={cart}
                getCartItemCount={getCartItemCount}
                subtotal={subtotal}
                shippingMethod={shippingMethod}
                shippingCost={shipping}
                taxAmount={tax}
                processingFee={processingFee}
                total={total}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
