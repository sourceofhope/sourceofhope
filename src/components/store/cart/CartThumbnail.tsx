"use client";

import Image from "next/image";
import { useState } from "react";

// Hosts next/image is configured to optimize (see next.config.ts).
const OPTIMIZABLE_SRC = /^(\/(?!\/)|https:\/\/cdn\.sanity\.io\/)/;

interface CartThumbnailProps {
  src?: string;
  alt: string;
  /** Rendered width hint, e.g. "64px". The parent must be `position: relative`. */
  sizes: string;
  fallbackClassName?: string;
}

/**
 * Product thumbnail for cart lines. Carts are saved in the browser, so an old
 * item can point at an image host Next can't optimize; those fall back to a
 * plain <img> instead of crashing the page.
 */
export default function CartThumbnail({
  src,
  alt,
  sizes,
  fallbackClassName = "text-neutral-500 text-sm",
}: CartThumbnailProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span className={fallbackClassName}>No image</span>;
  }

  if (!OPTIMIZABLE_SRC.test(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- legacy saved-cart URL on a host Next doesn't optimize
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
