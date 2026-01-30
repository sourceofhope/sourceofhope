import { Helmet } from "react-helmet-async";
import { CANONICAL_URL } from "../../routes";
import { useEffect } from "react";
import { useCartActions, SHIPPING_OPTIONS } from "../../context/StoreCartContext";
import Title from "../../components/ui/text/Title";
import Heading from "../../components/ui/text/Heading";
import CartSummarySection from "../cart/sections/CartSummarySection";
import ExpressCheckoutSection from "./sections/ExpressCheckoutSection";
import SelfCheckoutSection from "./sections/SelfCheckoutSection";
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Express Checkout Section */}
              <ExpressCheckoutSection total={total} />

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-neutral-300"></div>
                <span className="text-neutral-500 text-sm font-semibold">OR</span>
                <div className="flex-1 h-px bg-neutral-300"></div>
              </div>

              {/* Self Checkout Section */}
              {/* <SelfCheckoutSection total={total} cart={cart} />
               */}
               <StripeCheckoutSection 
                 items={cart}
                 shippingMethod={shippingMethod}
                 shippingCost={shipping}
                 taxAmount={tax}
               />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Order Details */}
              {/* <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex flex-col gap-1 mb-4">
                  <Title className="text-xl">Order Details</Title>
                  <Heading className="text-sm">Your Selected Items</Heading>
                </div>
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size}-${index}`}
                      className="flex gap-3 p-3 border-2 border-neutral-200 rounded-xl hover:border-accent-500 transition-colors"
                    >
                      <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML =
                              '<span class="text-neutral-500 text-xs">No image</span>';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-neutral-900 text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-accent-600 font-semibold text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex gap-2 text-xs text-neutral-600 mt-1">
                          {item.size && <span>Size: {item.size}</span>}
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <p className="text-neutral-700 font-semibold text-sm mt-1">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t-2 border-neutral-200">
                    <p className="text-sm text-neutral-600 text-right">
                      {getCartItemCount()} item
                      {getCartItemCount() !== 1 ? "s" : ""} • Subtotal: $
                      {subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Order Summary */}
              {/* <CartSummarySection
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}