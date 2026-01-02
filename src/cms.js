const CMS_HOME_URL = "https://cms.thesourceofhope.org/wp-json/wp/v2";

export async function fetchContent(endpoint, options = {}) {
  const res = await fetch(`${CMS_HOME_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CMS API Error: ${res.status} – ${text}`);
  }
  return res.json();
}

export function getFeaturedImage(post) {
  return post?._embedded?.["wp:featuredmedia"]?.[0] ?? null;
}

export function getResponsiveImage(image, { width }) {
  if (!image) return null;

  const sizes = image.media_details?.sizes;
  if (!sizes) return image.source_url;

  const candidates = [
    sizes.thumbnail,
    sizes.medium,
    sizes.medium_large,
    sizes.large,
    { source_url: image.source_url, width: image.media_details.width },
  ].filter(Boolean);

  return (
    candidates.find((img) => img.width >= width)?.source_url || image.source_url
  );
}
