"use client";

import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from "react";

const CART_STORAGE_KEY = "sourceofhope_cart";
const SHIPPING_STORAGE_KEY = "sourceofhope_shipping";
const PROCESSING_FEE_KEY = "sourceofhope_processing";

export interface CartItem {
  id: string;
  slug?: string;
  title?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

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

interface StoreCartContextType {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  processingFee: boolean;
  setProcessingFee: (fee: boolean) => void;
}

export const StoreCartContext = createContext<StoreCartContextType | undefined>(
  undefined
);

export function useStoreContext() {
  const context = useContext(StoreCartContext);
  if (!context) {
    throw new Error("useStoreContext must be used within StoreCartProvider");
  }
  return context;
}

export function StoreCartProvider({ children }: { children: ReactNode }) {
  // Load cart from localStorage on initial mount
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  // Load shipping method from localStorage on initial mount
  const [shippingMethod, setShippingMethod] = useState<string>(() => {
    if (typeof window === 'undefined') return 'standard';
    try {
      const savedShipping = localStorage.getItem(SHIPPING_STORAGE_KEY);
      return savedShipping || "standard";
    } catch (error) {
      console.error("Failed to load shipping method from localStorage:", error);
      return "standard";
    }
  });

  // Load processing fee from localStorage on initial mount
  const [processingFee, setProcessingFee] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const savedProcessingFee = localStorage.getItem(PROCESSING_FEE_KEY);
      return savedProcessingFee ? JSON.parse(savedProcessingFee) : false;
    } catch (error) {
      console.error("Failed to load processing fee from localStorage:", error);
      return false;
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Save shipping method to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SHIPPING_STORAGE_KEY, shippingMethod);
    } catch (error) {
      console.error("Failed to save shipping method to localStorage:", error);
    }
  }, [shippingMethod]);

  // Save processing fee to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROCESSING_FEE_KEY, JSON.stringify(processingFee));
    } catch (error) {
      console.error("Failed to save processing fee to localStorage:", error);
    }
  }, [processingFee]);

  return (
    <StoreCartContext.Provider
      value={{
        cart,
        setCart,
        shippingMethod,
        setShippingMethod,
        processingFee,
        setProcessingFee,
      }}
    >
      {children}
    </StoreCartContext.Provider>
  );
}

export function useCartActions() {
  const { cart, setCart, shippingMethod, setShippingMethod, processingFee, setProcessingFee } =
    useStoreContext();

  function addToCart(item: CartItem) {
    setCart((prev) => {
      // Normalize size comparison: treat undefined, null, and empty string as the same
      const itemSize = item.size || '';
      const existingItemIndex = prev.findIndex(
        (i) => i.id === item.id && (i.size || '') === itemSize
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

  function updateCartItem(id: string, updates: Partial<CartItem>) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  function removeFromCart(id: string, size?: string) {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && (item.size || '') === (size || '')))
    );
  }

  function clearCart() {
    setCart([]);
    setShippingMethod("standard");
  }

  function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartCost() {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
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

  function updateShippingMethod(method: string) {
    if (SHIPPING_OPTIONS.find((opt) => opt.id === method)) {
      setShippingMethod(method);
    }
  }

  function updateProcessingFee(toggle: boolean) {
    setProcessingFee(!!toggle);
  }

  function getProcessingFeeCost() {
    const processingFeeCost = processingFee
      ? (getCartCost() + getTaxCost() + getShippingCost()) *
        STANDARD_PROCESSING_RATE
      : 0;
    return parseFloat(processingFeeCost.toFixed(2));
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

  return {
    cart,
    processingFee,
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
