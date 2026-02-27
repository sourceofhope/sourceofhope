import { createContext, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "sourceofhope_cart";
const SHIPPING_STORAGE_KEY = "sourceofhope_shipping";
const PROCESSING_FEE_KEY = "sourceofhope_processing";

export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Shipping",
    time: "5-7 business days",
    cost: 5.99,
  },
  {
    id: "express",
    name: "Express Shipping",
    time: "2-3 business days",
    cost: 12.99,
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    time: "Next business day",
    cost: 24.99,
  },
];

export const STANDARD_TAX_RATE = 0.0825;
export const STANDARD_PROCESSING_RATE = 0.03;

export const StoreCartContext = createContext({
  cart: [],
  setCart: () => {},
  shippingMethod: "standard",
  setShippingMethod: () => {},
  processingFee: false,
  setProcessingFee: () => {},
});

export const useStoreContext = () => useContext(StoreCartContext);

export function StoreCartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial mount
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  const [shippingMethod, setShippingMethod] = useState(() => {
    // Load shipping method from localStorage on initial mount
    try {
      const savedShipping = localStorage.getItem(SHIPPING_STORAGE_KEY);
      return savedShipping || "standard";
    } catch (error) {
      console.error("Failed to load shipping method from localStorage:", error);
      return "standard";
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Save shipping method to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SHIPPING_STORAGE_KEY, shippingMethod);
    } catch (error) {
      console.error("Failed to save shipping method to localStorage:", error);
    }
  }, [shippingMethod]);

  const [applyFee, setApplyFee] = useState(() => {
    try {
      const savedProcessingFee = localStorage.getItem(PROCESSING_FEE_KEY);
      return savedProcessingFee ? JSON.parse(savedProcessingFee) : false;
    } catch (error) {
      console.error("Failed to load processing fee from localStorage:", error);
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROCESSING_FEE_KEY, JSON.stringify(applyFee));
    } catch (error) {
      console.error("Failed to save processing fee to localStorage:", error);
    }
  }, [applyFee]);

  return (
    <StoreCartContext.Provider
      value={{
        cart,
        setCart,
        shippingMethod,
        setShippingMethod,
        applyFee,
        setApplyFee,
      }}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useCartActions() {
  const {
    cart,
    setCart,
    shippingMethod,
    setShippingMethod,
    applyFee,
    setApplyFee,
  } = useStoreContext();

  function addToCart(item) {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (i) => i.id === item.id && i.size === item.size,
      );

      if (existingItemIndex !== -1) {
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, item];
    });
  }

  function updateCartItem(id, updates) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
    setShippingMethod("standard");
  }

  function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartTotal() {
    // Match Stripe/PayPal rounding: round each component, then sum and round final total
    const subtotal = parseFloat(getCartCost().toFixed(2));
    const shipping = parseFloat(getShippingCost().toFixed(2));
    const processing = parseFloat(getProcessingFeeCost().toFixed(2));
    const tax = parseFloat(getTaxCost().toFixed(2));
    const pretotal = parseFloat((subtotal + shipping + tax).toFixed(2));
    const total = parseFloat((pretotal + processing).toFixed(2));
    return total;
  }

  function getCartCost() {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return parseFloat(subtotal.toFixed(2));
  }

  function getTaxCost() {
    const taxFee = getCartCost() * STANDARD_TAX_RATE;
    return parseFloat(taxFee.toFixed(2));
  }

  function getShippingCost() {
    const option = SHIPPING_OPTIONS.find((opt) => opt.id === shippingMethod);
    return option ? parseFloat(option.cost.toFixed(2)) : 0;
  }

  function updateShippingMethod(method) {
    if (SHIPPING_OPTIONS.find((opt) => opt.id === method)) {
      setShippingMethod(method);
    }
  }

  function updateProcessingFee(toggle) {
    setApplyFee(!!toggle);
  }

  function getProcessingFeeCost() {
    const processingFee = applyFee
      ? (getCartCost() + getTaxCost() + getShippingCost()) *
        STANDARD_PROCESSING_RATE
      : 0;
    return parseFloat(processingFee.toFixed(2));
  }

  return {
    cart,
    applyFee,
    shippingMethod,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCost,
    getTaxCost,
    getCartItemCount,
    getCartTotal,
    getShippingCost,
    updateShippingMethod,
    updateProcessingFee,
    getProcessingFeeCost,
  };
}
