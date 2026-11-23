import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import messages from "../messages/en-US.json";

/** Render with the real English messages, as every page does (ADR-0009 §6). */
export function renderWithIntl(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale="en-US" messages={messages} timeZone="America/Chicago">
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });
}

export * from "@testing-library/react";
