"use client";

import type { ComponentProps, ReactNode } from "react";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Checkbox as SdkCheckbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { Field as SdkField, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/react/field";
import { Input as SdkInput } from "@ui-sdk/react/input";
import { Textarea as SdkTextarea } from "@ui-sdk/react/textarea";
import { useTranslations } from "next-intl";
import { choiceStyles, fieldStyles } from "./field.styles";

export type FieldProps = {
  /** Visible label. Always required, even when hidden, so the control has a name. */
  label: ReactNode;
  /** Hide the label visually (the language dropdown); screen readers still hear it. */
  hideLabel?: boolean;
  /** Help text under the control. */
  description?: ReactNode;
  /** The error to show, usually from the form (`errors.email?.message`). */
  error?: string;
  /** Marks the label "(optional)". Required is the default, so it gets no mark. */
  optional?: boolean;
  /** The name the control submits under, when the control has none. */
  name?: string;
  disabled?: boolean;
  /** One control: Input, Textarea or Select. */
  children: ReactNode;
};

/**
 * Field: the label, help text and error around one control. It wires up
 * `for`, `aria-describedby` and `aria-invalid`. Errors come from the form
 * (react-hook-form + zod via useZodForm), not the browser's bubbles.
 */
export function Field({ label, hideLabel, description, error, optional, name, disabled, children }: FieldProps) {
  const t = useTranslations("UI");
  const s = fieldStyles({ hideLabel });
  return (
    <SdkField name={name} disabled={disabled} invalid={error ? true : undefined} className={s.root()}>
      <FieldLabel className={s.label()}>
        {label}
        {optional ? (
          <>
            {" "}
            <span className={s.optional()}>({t("optional")})</span>
          </>
        ) : null}
      </FieldLabel>
      {description ? <FieldDescription className={s.description()}>{description}</FieldDescription> : null}
      {children}
      {error ? (
        <FieldError match className={s.error()}>
          <ExclamationCircleIcon aria-hidden="true" />
          {error}
        </FieldError>
      ) : null}
    </SdkField>
  );
}

/** Input: a one-line text control. Put it inside a Field. Works with `register()`. */
export function Input(props: Omit<ComponentProps<typeof SdkInput>, "className">) {
  return <SdkInput {...props} className={fieldStyles().control()} />;
}

/** Textarea: a multi-line text control. Put it inside a Field. */
export function Textarea(props: Omit<ComponentProps<typeof SdkTextarea>, "className">) {
  return <SdkTextarea rows={4} {...props} className={fieldStyles().control({ class: "py-3" })} />;
}

export type CheckboxProps = Omit<ComponentProps<typeof SdkCheckbox>, "className" | "children"> & {
  label: ReactNode;
  description?: ReactNode;
  error?: string;
};

/**
 * Checkbox: one yes/no choice with its label beside it ("Email me about
 * future events", waiver consent). The whole row is the click target.
 */
export function Checkbox({ label, description, error, ...props }: CheckboxProps) {
  const c = choiceStyles();
  const f = fieldStyles();
  return (
    <SdkField invalid={error ? true : undefined} className={f.root()}>
      <FieldLabel className={c.row()}>
        <SdkCheckbox {...props} className={c.box()}>
          <CheckboxIndicator className={c.check()}>
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </SdkCheckbox>
        <span className="flex flex-col gap-0.5">
          <span>{label}</span>
          {description ? <FieldDescription className={f.description()}>{description}</FieldDescription> : null}
        </span>
      </FieldLabel>
      {error ? (
        <FieldError match className={f.error()}>
          <ExclamationCircleIcon aria-hidden="true" />
          {error}
        </FieldError>
      ) : null}
    </SdkField>
  );
}
