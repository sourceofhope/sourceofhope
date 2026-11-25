import { PageSkeleton } from "@/components/layout/templates";

/* Shown while a rebuilt page streams in: the template's shape, not a spinner (spec §10.11). */
export default function Loading() {
  return <PageSkeleton />;
}
