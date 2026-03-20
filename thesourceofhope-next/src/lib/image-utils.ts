/**
 * Utility functions for handling image data from API responses
 */

interface MediaDetails {
  altText?: string;
  sourceUrl?: string;
}

interface FeaturedMedia {
  alt_text?: string;
  source_url?: string;
}

interface MediaResponse {
  _embedded?: {
    'wp:featuredmedia'?: FeaturedMedia[];
  };
}

export function getFeaturedImage(post: MediaResponse): FeaturedMedia | null {
  return post?._embedded?.['wp:featuredmedia']?.[0] ?? null;
}

export function getResponsiveImage(
  image: FeaturedMedia | MediaDetails | null,
  { width }: { width: number }
): string | null {
  if (!image) return null;

  // Handle both WordPress and Sanity image formats
  const sourceUrl = (image as FeaturedMedia)?.source_url || (image as MediaDetails)?.sourceUrl;
  
  return sourceUrl || null;
}
