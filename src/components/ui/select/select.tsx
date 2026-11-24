"use client";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  Select as SdkSelect,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { Field, type FieldProps } from "../field/field";
import { fieldStyles } from "../field/field.styles";
import { tv } from "../lib/tv";

const selectStyles = tv({
  slots: {
    trigger: "flex items-center justify-between gap-2 text-left data-placeholder:text-muted [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:text-muted",
    content: [
      "z-(--z-overlay) max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-md border border-line bg-surface p-1 shadow-overlay outline-none",
      "transition-opacity duration-(--duration-base) data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
    ],
    item: [
      "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-sm px-3 text-ink outline-none",
      "data-highlighted:bg-surface-muted data-selected:font-semibold data-disabled:cursor-not-allowed data-disabled:text-muted",
    ],
    indicator: "size-5 text-action",
  },
});

export type SelectOption<Value extends string = string> = { value: Value; label: string; disabled?: boolean };

export type SelectProps<Value extends string = string> = Omit<FieldProps, "children"> & {
  options: readonly SelectOption<Value>[];
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null) => void;
  placeholder?: string;
  required?: boolean;
};

/**
 * Select: choose one option from a short list (the language dropdown, a
 * shirt size). Comes with its own Field, so it always has a label.
 */
export function Select<Value extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  required,
  name,
  ...field
}: SelectProps<Value>) {
  const s = selectStyles();
  return (
    <Field {...field} name={name}>
      <SdkSelect<Value>
        items={options as SelectOption<Value>[]}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => onValueChange?.(next)}
        placeholder={placeholder}
        required={required}
        name={name}
      >
        <SelectTrigger className={fieldStyles().control({ class: s.trigger() })}>
          <SelectValue />
          <ChevronUpDownIcon aria-hidden="true" />
        </SelectTrigger>
        <SelectContent sideOffset={4} className={s.content()}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled} className={s.item()}>
              {option.label}
              <SelectItemIndicator className={s.indicator()}>
                <CheckIcon aria-hidden="true" />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </SdkSelect>
    </Field>
  );
}
