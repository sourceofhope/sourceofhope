"use client";

import { useEffect } from "react";
import { useHeaderContext } from "@/context/HeaderContext";

export default function Block() {
  const headerContext = useHeaderContext();
  const setIsBlocking = headerContext?.setIsBlocking;

  useEffect(() => {
    if (setIsBlocking) {
      setIsBlocking(true);
      return () => setIsBlocking(false);
    }
  }, [setIsBlocking]);

  return null;
}
