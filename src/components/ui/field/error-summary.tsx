"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { tv } from "../lib/tv";

const errorSummaryStyles = tv({
  slots: {
    root: "rounded-md border-2 border-danger bg-danger-subtle p-4 text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
    title: "m-0 font-heading text-lg font-bold",
    list: "mt-2 flex list-disc flex-col gap-1 pl-5",
    link: "font-semibold text-danger underline underline-offset-4",
  },
});

export type ErrorSummaryItem = {
  /** The `id` of the control to focus (the Input's `id`). */
  fieldId: string;
  message: string;
};

/**
 * ErrorSummary: after a failed submit on a long form, list every problem at
 * the top and move focus here. Each item jumps to its field. Render it only
 * when there are errors and a submit was tried.
 */
export function ErrorSummary({ errors }: { errors: ErrorSummaryItem[] }) {
  const t = useTranslations("UI");
  const s = errorSummaryStyles();
  const ref = useRef<HTMLDivElement>(null);
  const count = errors.length;

  useEffect(() => {
    if (count > 0) ref.current?.focus();
  }, [count]);

  if (count === 0) return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" aria-labelledby="error-summary-title" className={s.root()}>
      <h2 id="error-summary-title" className={s.title()}>
        {t("errorSummary", { count })}
      </h2>
      <ul className={s.list()}>
        {errors.map((item) => (
          <li key={item.fieldId}>
            <a
              href={`#${item.fieldId}`}
              className={s.link()}
              onClick={(event) => {
                const target = document.getElementById(item.fieldId);
                if (!target) return;
                event.preventDefault();
                target.focus();
                target.scrollIntoView({ block: "center" });
              }}
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
