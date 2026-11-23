"use client";

import { useEffect } from "react";
import { useHeaderContext } from "@/context/HeaderContext";

export default function HeaderBlocker() {
  const headerContext = useHeaderContext();
  const setIsBlocking = headerContext?.setIsBlocking;

  useEffect(() => {
    if (!setIsBlocking) {
      return;
    }

    setIsBlocking(true);

    return () => setIsBlocking(false);
  }, [setIsBlocking]);

  return null;
}
