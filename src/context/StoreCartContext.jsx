import { createContext, useContext, useState } from "react";

export const StoreCartContext = createContext({
  cart: [],
  setCart: () => {},
});

export const useStoreContext = () => useContext(StoreCartContext);

export function StoreCartProvider({ children }) {
  const [cart, setCart] = useState([]);

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
      // Check if item with same id and size already exists
      const existingItemIndex = prev.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + item.quantity,
        };
        return updated;
      }

      // Add new item
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
