"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { ORGANIZATION } from "@/content/organization";
import type { VolunteerStep } from "@/lib/hub-url";
import { EventDetailsBody, useHubEvent } from "./event-details";
import { HubLoading, HubStep, HubTitle } from "./hub-frame";
import { HubError } from "./hub-states";
import { VolunteerLanding } from "./volunteer-door";

/** A chosen event's volunteer side, until the sign-up steps (Phase 6) take over. */
function VolunteerEvent({ slug }: { slug: string }) {
  const t = useTranslations("Hub.volunteer");
  const data = useHubEvent(slug);
  return (
    <HubStep label={t("door")} parent={{ action: "volunteer" }}>
      {data.status === "loading" ? <HubLoading /> : null}
      {data.status === "error" ? <HubError onRetry={data.retry} /> : null}
      {data.status === "not-found" ? <HubTitle>{t("notFound")}</HubTitle> : null}
      {data.status === "ready" ? (
        <>
          <EventDetailsBody event={data.data.event} side="volunteer" fixedSide />
          <Alert tone="info" title={t("signupSoonTitle")}>
            <p className="m-0">{t("signupSoon", { phone: ORGANIZATION.phone.display, email: ORGANIZATION.email.display })}</p>
          </Alert>
        </>
      ) : null}
    </HubStep>
  );
}

/** Routes Volunteer's URL state to its step (spec §9.6). */
export function VolunteerFlow({ event }: { event?: string; step?: VolunteerStep }) {
  if (event) return <VolunteerEvent slug={event} />;
  return <VolunteerLanding />;
}
