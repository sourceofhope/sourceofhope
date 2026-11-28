"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RadioCards } from "@/components/ui/radio-cards";
import { GIVE_STEPS, GIVE_TYPES, type GiveType, type HubState } from "@/lib/hub-url";
import { useHub } from "../hub-context";
import { HubLanding, HubTitle } from "../hub-frame";

type GiveState = Extract<HubState, { action: "give" }>;

/** Give's door landing (spec §9.7): four type cards; `type` pre-selects one. */
function GiveLanding({ state }: { state: GiveState }) {
  const t = useTranslations("Hub.give");
  const hub = useHub();
  const [type, setType] = useState<GiveType | null>(state.type ?? null);
  const [error, setError] = useState(false);
  return (
    <HubLanding
      door="give"
      actions={
        <Button
          type="button"
          onClick={() => {
            if (!type) return setError(true);
            hub.push({ action: "give", type, designation: state.designation, step: GIVE_STEPS[type][0] });
          }}
        >
          {t("continue")}
        </Button>
      }
    >
      <HubTitle intro={t("intro")}>{t("title")}</HubTitle>
      <RadioCards
        label={t("typeLabel")}
        layout="list"
        options={GIVE_TYPES.map((value) => ({ value, label: t(`types.${value}.label`), description: t(`types.${value}.hint`) }))}
        value={type}
        onValueChange={(value) => {
          setType(value);
          setError(false);
        }}
        error={error ? t("typeError") : undefined}
      />
    </HubLanding>
  );
}

/** Routes Give's URL state to its type's flow. */
export function GiveFlow({ state }: { state: GiveState }) {
  return <GiveLanding key={state.type ?? "none"} state={state} />;
}
