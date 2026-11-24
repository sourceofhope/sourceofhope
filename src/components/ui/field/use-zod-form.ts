"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues, type UseFormProps } from "react-hook-form";
import type { z } from "zod";

/**
 * useZodForm: the one way forms validate (ADR-0009). The same zod schema runs
 * on the server in the route handler, so client and server agree on every rule.
 * Errors show after a field is left or the form is submitted, then update live.
 */
export function useZodForm<Schema extends z.ZodType<FieldValues, FieldValues>>(
  schema: Schema,
  options?: Omit<UseFormProps<z.input<Schema>, unknown, z.output<Schema>>, "resolver">,
) {
  return useForm<z.input<Schema>, unknown, z.output<Schema>>({
    mode: "onTouched",
    shouldFocusError: false,
    ...options,
    resolver: zodResolver(schema),
  });
}
