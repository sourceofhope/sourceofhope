import { PageSkeleton } from "@/components/layout/templates";

/*
 * Shown while the Events page loads: the template's shape, not a spinner
 * (spec §10.11). Loading states live on segments that never 404: a loading
 * boundary starts the response early, so a notFound() under it can't set
 * the 404 status.
 */
export default function Loading() {
  return <PageSkeleton />;
}
