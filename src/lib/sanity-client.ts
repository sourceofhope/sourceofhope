import "server-only";

import { createClient } from "next-sanity";
import { getEnvironment } from "@/lib/environment";

const { sanityProjectId, sanityDataset, sanityApiVersion, sanityApiReadToken } =
  getEnvironment();

const projectId = sanityProjectId;
const dataset = sanityDataset;
const apiVersion = sanityApiVersion;
const token = sanityApiReadToken;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !token,
  token,
  perspective: "published",
});
