import { createContext, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "sourceofhope_cart";
const SHIPPING_STORAGE_KEY = "sourceofhope_shipping";

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

export const StoreCartContext = createContext({
  cart: [],
  setCart: () => {},
  shippingMethod: "standard",
  setShippingMethod: () => {},
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

  return (
    <StoreCartContext.Provider value={{ cart, setCart, shippingMethod, setShippingMethod }}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useCartActions() {
  const { cart, setCart, shippingMethod, setShippingMethod } = useStoreContext();

  function addToCart(item) {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (i) => i.id === item.id && i.size === item.size
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
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getShippingCost() {
    const option = SHIPPING_OPTIONS.find(opt => opt.id === shippingMethod);
    return option ? option.cost : 0;
  }

  function updateShippingMethod(method) {
    if (SHIPPING_OPTIONS.find(opt => opt.id === method)) {
      setShippingMethod(method);
    }
  }

  return {
    cart,
    shippingMethod,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    getShippingCost,
    updateShippingMethod,
  };
}
