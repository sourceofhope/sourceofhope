import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Container } from "../container";
import { Main } from "./main";

/**
 * PageSkeleton: the loading state for a page (spec §10.11). The shape of a
 * PageHeader and a card grid, so the page doesn't jump when it arrives.
 * Screen readers hear "Loading…" once.
 */
export function PageSkeleton() {
  const t = useTranslations("UI");
  return (
    <Main>
      <div role="status" aria-live="polite">
        <VisuallyHidden>{t("loading")}</VisuallyHidden>
        <div aria-hidden="true">
          <div className="bg-surface-muted py-section-sm">
            <Container>
              <div className="flex max-w-prose flex-col gap-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </Container>
          </div>
          <div className="py-section">
            <Container>
              <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex flex-col gap-3">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </li>
                ))}
              </ul>
            </Container>
          </div>
        </div>
      </div>
    </Main>
  );
}
