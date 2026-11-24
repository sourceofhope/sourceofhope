import { CheckIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import { tv } from "../lib/tv";

const stepsStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    status: "m-0 text-sm font-semibold text-muted",
    list: "m-0 flex list-none gap-2 p-0",
    step: "flex flex-1 flex-col gap-1.5 text-sm",
    bar: "h-1 rounded-full",
    label: "hidden items-center gap-1 sm:flex [&_svg]:size-4",
  },
  variants: {
    state: {
      done: { bar: "bg-action", label: "text-ink" },
      current: { bar: "bg-action", label: "font-semibold text-ink" },
      upcoming: { bar: "bg-line", label: "text-muted" },
    },
  },
});

export type StepsProps = {
  /** Every step's short name, in order. */
  steps: readonly string[];
  /** The current step, from 1. */
  current: number;
};

/**
 * Steps: where you are in a short flow (sign-up, giving). Phones show
 * "Step 2 of 3" and the bars; wider screens add each step's name.
 */
export function Steps({ steps, current }: StepsProps) {
  const t = useTranslations("UI");
  const s = stepsStyles();
  return (
    <div className={s.root()}>
      <p className={s.status()}>{t("stepOf", { current, total: steps.length })}</p>
      <ol className={s.list()}>
        {steps.map((name, index) => {
          const position = index + 1;
          const state = position < current ? "done" : position === current ? "current" : "upcoming";
          const v = stepsStyles({ state });
          return (
            <li key={name} className={s.step()} aria-current={state === "current" ? "step" : undefined}>
              <span className={v.bar()} aria-hidden="true" />
              <span className={v.label()}>
                {state === "done" ? <CheckIcon aria-hidden="true" /> : null}
                {name}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
