import { Helmet } from "react-helmet-async";
import { CANONICAL_URL } from "../../routes";
import { useEffect } from "react";
import { useCartActions, SHIPPING_OPTIONS } from "../../context/StoreCartContext";
import Title from "../../components/ui/text/Title";
import ExpressCheckoutSection from "./sections/ExpressCheckoutSection";
import StripeCheckoutSection from "./sections/StripeCheckoutSection";
import { useSetHeaderBlocking } from "../../components/structure/Header";
import Cart from "../storefront/Cart";

export default function CheckoutPage() {
  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);

  const { cart, getCartTotal, getCartItemCount, getShippingCost, shippingMethod } = useCartActions();

  const subtotal = getCartTotal();
  const shipping = getShippingCost();
  const taxRate = 0.0825;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

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
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-2xl transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </section>
      ) : (
        <div className="min-h-screen bg-neutral-50 pt-25 px-5 md:px-10 lg:px-35">
          <div className="flex flex-col gap-1">
            <Title>Checkout</Title>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left: Express Checkout Section (25%) */}
            <div className="lg:col-span-1 space-y-8">
              <ExpressCheckoutSection
                items={cart}
                shippingMethod={shippingMethod}
                shippingCost={shipping}
                taxAmount={tax}
              />
            </div>

            {/* Right: Stripe Checkout Section (75%) */}
            <div className="lg:col-span-3 space-y-8">
              <StripeCheckoutSection
                items={cart}
                shippingMethod={shippingMethod}
                shippingCost={shipping}
                taxAmount={tax}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}