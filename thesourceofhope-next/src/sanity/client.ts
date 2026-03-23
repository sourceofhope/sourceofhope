import "server-only";
import { createClient } from "next-sanity";
import { getEnvironment } from "@/lib/environment";

const { sanityProjectId, sanityDataset, sanityApiVersion, sanityApiReadToken } = getEnvironment();

const projectId = sanityProjectId || "sgzdqn9z";
const dataset = sanityDataset || "production";
const apiVersion = sanityApiVersion || "2026-03-16";
const token = sanityApiReadToken;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !token,
  token,
  perspective: "published",
});