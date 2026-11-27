import "server-only";
import { unstable_cache } from "next/cache";
import { createClient, type SanityClient } from "next-sanity";
import { env } from "@/lib/env.server";
import { createLogger } from "@/lib/platform/log";

const log = createLogger("content");

/** Every content query is cached under this tag; the Sanity webhook revalidates it. */
export const CONTENT_TAG = "content";

let client: SanityClient | null | undefined;

function sanity(): SanityClient | null {
  if (client !== undefined) return client;
  const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, NEXT_PUBLIC_SANITY_API_VERSION: apiVersion, SANITY_API_READ_TOKEN: token } = env();
  client = projectId && dataset ? createClient({ projectId, dataset, apiVersion: apiVersion ?? "2026-04-10", useCdn: !token, token, perspective: "published" }) : null;
  return client;
}

/** The project and dataset, for building asset URLs. */
export function sanityConfig() {
  const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset } = env();
  return projectId && dataset ? { projectId, dataset } : null;
}

/**
 * Run a GROQ query. Returns null when Sanity isn't configured or fails, so a
 * page falls back to built-in content instead of erroring; failures are
 * logged. Cached for ten minutes under CONTENT_TAG.
 */
export const fetchContent = unstable_cache(
  async <T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> => {
    const sanityClient = sanity();
    if (!sanityClient) return null;
    try {
      return await sanityClient.fetch<T>(query, params);
    } catch (error) {
      log.error("query failed", { error });
      return null;
    }
  },
  ["content"],
  { tags: [CONTENT_TAG], revalidate: 600 },
) as <T>(query: string, params?: Record<string, unknown>) => Promise<T | null>;
