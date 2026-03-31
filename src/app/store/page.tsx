'use client';

import { useEffect } from 'react';
import StorefrontProductSection from "@/components/store/StorefrontProductSection";
import StorefrontFooterSection from "@/components/store/StorefrontFooterSection";
import Cart from "@/components/store/Cart";
import { useHeaderContext } from "@/context/HeaderContext";

export default function Store() {
  const headerContext = useHeaderContext();
  const setIsBlocking = headerContext?.setIsBlocking;

  useEffect(() => {
    if (setIsBlocking) {
      setIsBlocking(true);
      return () => setIsBlocking(false);
    }
  }, [setIsBlocking]);

  return (
    <>
      <Cart />
      <StorefrontProductSection />
      <StorefrontFooterSection />
    </>
  );
}
