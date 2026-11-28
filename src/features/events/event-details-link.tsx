"use client";

import type { ReactNode } from "react";
import { useEventLink } from "@/components/layout/hub-link";
import { CardLink } from "@/components/ui/card";

/** The card's one link: opens the event's details in the Hub on the current page. */
export function EventDetailsLink({ slug, children }: { slug: string; children: ReactNode }) {
  return <CardLink {...useEventLink(slug)}>{children}</CardLink>;
}
