import { text } from "./localized";

/**
 * Images from Sanity, ready for the Image primitive. Queries project
 * `"src": asset->url, "width": …, "height": …` plus alt, decorative and
 * consentCleared (see IMAGE_PROJECTION).
 */
export type ContentImage = { src: string; alt: string; width: number; height: number };

export const IMAGE_PROJECTION = `{
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  alt, decorative, consentCleared
}`;

type RawImage = { src?: string; width?: number; height?: number; alt?: unknown; decorative?: boolean; consentCleared?: boolean } | null | undefined;

/**
 * Null when there's nothing usable. In the v2 shape an image without
 * confirmed consent is never shown (ADR-0007); today's images predate the
 * consent field and stay visible until they're migrated and reviewed.
 */
export function toContentImage(raw: RawImage, locale = "en"): ContentImage | null {
  if (!raw?.src || !raw.width || !raw.height) return null;
  if (raw.consentCleared === false) return null;
  return { src: raw.src, alt: raw.decorative ? "" : (text(raw.alt, locale) ?? ""), width: raw.width, height: raw.height };
}

/**
 * The CDN URL for a Sanity asset id ("image-<hash>-<w>x<h>-<ext>"), used for
 * event hero images stored in Postgres (02 §4).
 */
export function sanityAssetUrl(assetId: string, projectId: string, dataset: string): { src: string; width: number; height: number } | null {
  const match = /^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/.exec(assetId);
  if (!match) return null;
  const [, hash, w, h, ext] = match;
  return { src: `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${w}x${h}.${ext}`, width: Number(w), height: Number(h) };
}
