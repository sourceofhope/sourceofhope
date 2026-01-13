import { createContext, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "sourceofhope_cart";

export const StoreCartContext = createContext({
  cart: [],
  setCart: () => {},
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  return (
    <StoreCartContext.Provider value={{ cart, setCart }}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useCartActions() {
  const { cart, setCart } = useStoreContext();

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

  return {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
  };
}
