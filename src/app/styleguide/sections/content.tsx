import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardLink } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Stat, StatList } from "@/components/ui/stat";

export function ContentSection() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Badges
        </Heading>
        <div className="flex flex-wrap gap-2">
          <Badge tone="public">Open to the public</Badge>
          <Badge tone="volunteer">Volunteers needed</Badge>
          <Badge tone="neutral">Partner event</Badge>
          <Badge tone="danger">Full</Badge>
          <Badge tone="success">Signed</Badge>
          <Badge tone="warning">Waiting for agreement</Badge>
          <Badge tone="info">New</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Alerts
        </Heading>
        <Alert tone="info" title="Sign-ups close 24 hours before the event.">
          Agreements must be signed by Thu, Dec 24 at 9:00 a.m. CT.
        </Alert>
        <Alert tone="success">You&apos;re on the list.</Alert>
        <Alert tone="warning" title="Alex still needs to finish.">
          We emailed them a link to sign their own agreement.
        </Alert>
        <Alert tone="danger" title="There is 1 problem with this form.">
          Enter an email like name@example.com.
        </Alert>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Cards
        </Heading>
        <ul className="grid gap-6 md:grid-cols-3">
          <Card as="li" interactive>
            <Image src="/v2/servingHope/Carousel-5.webp" alt="Volunteers packing hot meals on a serving line" width={800} height={450} className="h-48 w-full" />
            <div className="flex flex-col gap-2 p-5">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="public">Open to the public</Badge>
                <Badge tone="volunteer">Volunteers needed</Badge>
              </div>
              <Heading level={4}>
                <CardLink href="/events">Serving Hope meal service</CardLink>
              </Heading>
              <p className="text-muted">Fri, Jan 22 · Cornerstone Kitchen, Dallas</p>
            </div>
          </Card>
          <Card as="li" tone="muted">
            <div className="flex flex-col gap-2 p-5">
              <Heading level={4}>Muted card (no link)</Heading>
              <p className="text-muted">For static content such as a story summary.</p>
            </div>
          </Card>
          <Card as="li">
            <div className="flex flex-col gap-3 p-5">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Impact numbers
        </Heading>
        <StatList>
          <Stat value="353,000" label="meals served" />
          <Stat value="273,000" label="volunteer hours" />
          <Stat value="$900,000" label="in holistic aid" />
          <Stat value="$500,000" label="given by donors" />
        </StatList>
        <div className="rounded-lg bg-surface-inverse p-6">
          <StatList surface="inverse">
            <Stat surface="inverse" value="12" label="years serving DFW" />
            <Stat surface="inverse" value="5" label="programs" />
          </StatList>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EmptyState
          level={3}
          title="No volunteer shifts are open right now."
          icon={<CalendarDaysIcon />}
          action={<LinkButton href="/events" variant="secondary">See all events</LinkButton>}
        >
          New dates are added every month.
        </EmptyState>
        <div className="flex items-center gap-3 text-muted">
          <Spinner /> Spinner (decorative; the owning region announces loading)
        </div>
      </div>
    </div>
  );
}
