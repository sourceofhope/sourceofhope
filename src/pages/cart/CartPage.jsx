import { useState, useEffect } from "react";
import { CANONICAL_URL } from "../../routes";
import { Helmet } from "react-helmet";
import CartItemsSection from "./sections/CartItemsSection";
import CartSummarySection from "./sections/CartSummarySection";
import CartPaymentSection from "./sections/CartPaymentSection";

import {
  HeaderFlagContext,
  useHeaderFlag,
} from "../../components/structure/Header";

const CartPage = () => {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Hope T-Shirt",
      price: 25.00,
      quantity: 2,
      size: "M",
      image: "/images/tshirt.jpg"
    },
    {
      id: 2,
      name: "Education Hope Hoodie",
      price: 45.00,
      quantity: 1,
      size: "L",
      image: "/images/hoodie.jpg"
    }
  ]);

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const updateSize = (id, newSize) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = shippingCosts[shippingMethod];
  const tax = subtotal * 0.0825; // 8.25% tax
  const total = subtotal + shipping + tax;

  return (
    <>
      <HeaderFlagContext.Provider value={true}>
        <Helmet>
          <title>Shopping Cart | The Source of Hope</title>
          <meta
            name="description"
            content="The Source of Hope is a nonprofit organization providing food, education, and holistic wellness to individuals and families across the DFW area."
          />
          <link rel="canonical" href={CANONICAL_URL.cart} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={CANONICAL_URL.cart} />
          <meta property="og:title" content="Cart | The Source of Hope" />
          <meta
            property="og:description"
            content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={CANONICAL_URL.cart} />
          <meta name="twitter:title" content="Cart | The Source of Hope" />
          <meta
            name="twitter:description"
            content="Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community."
          />
        </Helmet>

        <div className="min-h-screen bg-neutral-50 py-8 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <CartItemsSection
                  items={cartItems}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  updateSize={updateSize}
                />
              </div>

              <div className="lg:col-span-1">
                <CartSummarySection
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  shippingCosts={shippingCosts}
                />

                <CartPaymentSection
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  total={total}
                />
              </div>
            </div>
          </div>
        </div>
      </HeaderFlagContext.Provider>
    </>
  );
}

export default CartPage
