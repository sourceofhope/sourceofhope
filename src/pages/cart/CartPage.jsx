import { useEffect, useContext } from "react";
import { CANONICAL, CANONICAL_URL } from "../../routes";
import { Helmet } from "react-helmet-async";
import CartItemsSection from "./sections/CartItemsSection";
import CartShippingSection from "./sections/CartShippingSection";
import CartSummarySection from "./sections/CartSummarySection";
import { Link } from "react-router-dom";

import {
  StoreCartContext,
  useCartActions,
  SHIPPING_OPTIONS,
} from "../../context/StoreCartContext";

import { useSetHeaderBlocking } from "../../components/structure/Header";
import { ShoppingBagIcon } from "@heroicons/react/20/solid";
import Title from "../../components/ui/text/Title";
import { AnchorButton, LinkButton } from "../../components/ui/Button";

const CartPage = () => {
  const { cart: cartItems } = useContext(StoreCartContext);
  const {
    updateCartItem,
    removeFromCart,
    shippingMethod,
    updateShippingMethod,
    getShippingCost,
  } = useCartActions();

  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(id, { quantity: newQuantity });
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const updateSize = (id, newSize) => {
    updateCartItem(id, { size: newSize });
  };

  const subtotal =
    cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = getShippingCost();
  const tax = subtotal * 0.0825; // 8.25% tax
  const total = subtotal + shipping + tax;

  return (
    <>
      <Helmet>
        <title>Shopping Cart | The Source of Hope</title>
        <meta
          name="description"
          content="The Source of Hope is a nonprofit organization providing food, education, and holistic wellness to individuals and families across the DFW area."
        />
        <link rel="canonical" href={CANONICAL_URL.storefront.cart} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.storefront.cart} />
        <meta property="og:title" content="Cart | The Source of Hope" />
        <meta
          property="og:description"
          content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.storefront.cart} />
        <meta name="twitter:title" content="Cart | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
        />
      </Helmet>
      {(!cartItems || cartItems.length === 0) && (
        <section className="w-full min-h-screen flex flex-col py-5 items-center justify-center text-center px-5">
          <div className="max-w-xl">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center shadow-sm">
              <ShoppingBagIcon className="w-10 h-10 text-accent-500" />
            </div>

            <Title>Your Cart is Empty</Title>
            <p className="text-gray-700 leading-relaxed mb-10">
              You don't have any items in your shopping cart yet. Visit our
              Storefront to view our full selection.
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
      {cartItems && cartItems.length > 0 && (
        <div className="min-h-screen bg-neutral-50 pt-25 px-5 md:px-10 lg:px-35">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
              <Title>Shopping Cart</Title>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-5 pb-5">
              <div className="lg:col-span-2">
                <CartItemsSection
                  items={cartItems}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  updateSize={updateSize}
                />
              </div>
              <div className="lg:col-span-1">
                <CartShippingSection
                  shippingMethod={shippingMethod}
                  setShippingMethod={updateShippingMethod}
                  shippingOptions={SHIPPING_OPTIONS}
                />
                <CartSummarySection
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                />
                <div className="mt-6">
                  <div className="mb-6">
                    <Link
                      to="/store/checkout"
                      className="w-full !no-underline block px-5 py-4 rounded-xl font-bold text-white text-lg text-center bg-accent-500 hover:bg-accent-600 hover:shadow-lg transition-all duration-300">
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
