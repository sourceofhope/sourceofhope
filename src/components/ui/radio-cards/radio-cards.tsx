"use client";

import { useId, type ReactNode } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio";
import { choiceStyles, fieldStyles } from "../field/field.styles";
import { tv } from "../lib/tv";

const radioCardsStyles = tv({
  slots: {
    root: "m-0 flex flex-col gap-2 border-0 p-0",
    legend: "mb-1 p-0 text-base font-semibold text-ink",
    group: "grid gap-3",
    card: [
      "flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-line bg-surface p-4 text-ink",
      "transition-colors duration-(--duration-fast) hover:border-input motion-reduce:transition-none",
      "has-data-checked:border-action has-data-checked:bg-surface-muted has-data-checked:ring-1 has-data-checked:ring-action",
    ],
    text: "flex flex-col gap-0.5",
    title: "font-semibold",
    hint: "text-sm text-muted",
  },
  variants: {
    layout: {
      list: { group: "grid-cols-1" },
      grid: { group: "grid-cols-2 sm:grid-cols-3" },
    },
  },
  defaultVariants: { layout: "list" },
});

export type RadioCardOption<Value extends string = string> = {
  value: Value;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioCardsProps<Value extends string = string> = {
  /** The question, shown as the group's legend. */
  label: ReactNode;
  description?: ReactNode;
  error?: string;
  options: readonly RadioCardOption<Value>[];
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value) => void;
  name?: string;
  required?: boolean;
  /** `grid` for short choices like gift amounts; `list` for choices with descriptions. */
  layout?: "list" | "grid";
};

/**
 * RadioCards: one choice from a few, each a large card (gift amount, guest or
 * volunteer, shift). Arrow keys move the choice; the whole card is clickable.
 */
export function RadioCards<Value extends string = string>({
  label,
  description,
  error,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  required,
  layout,
}: RadioCardsProps<Value>) {
  const id = useId();
  const s = radioCardsStyles({ layout });
  const c = choiceStyles();
  const f = fieldStyles();
  const describedBy = [description ? `${id}-description` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return (
    <fieldset className={s.root()}>
      <legend id={`${id}-legend`} className={s.legend()}>
        {label}
      </legend>
      {description ? (
        <p id={`${id}-description`} className={f.description({ class: "m-0" })}>
          {description}
        </p>
      ) : null}
      <RadioGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => onValueChange?.(next as Value)}
        name={name}
        required={required}
        aria-labelledby={`${id}-legend`}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={s.group()}
      >
        {options.map((option) => (
          <label key={option.value} className={s.card()}>
            <Radio value={option.value} disabled={option.disabled} className={c.dot()}>
              <RadioIndicator className={c.dotFill()} />
            </Radio>
            <span className={s.text()}>
              <span className={s.title()}>{option.label}</span>
              {option.description ? <span className={s.hint()}>{option.description}</span> : null}
            </span>
          </label>
        ))}
      </RadioGroup>
      {error ? (
        <p id={`${id}-error`} className={f.error({ class: "m-0" })}>
          <ExclamationCircleIcon aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
