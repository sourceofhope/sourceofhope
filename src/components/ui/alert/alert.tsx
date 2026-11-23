import type { ComponentProps, ReactNode } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { tv, type VariantProps } from "../lib/tv";

const alertStyles = tv({
  slots: {
    root: "flex gap-3 rounded-md px-4 py-3",
    icon: "mt-0.5 size-5 shrink-0",
    body: "flex flex-col gap-1",
    title: "font-semibold",
  },
  variants: {
    tone: {
      info: { root: "bg-info-subtle text-info" },
      success: { root: "bg-success-subtle text-success" },
      warning: { root: "bg-warning-subtle text-warning" },
      danger: { root: "bg-danger-subtle text-danger" },
    },
  },
  defaultVariants: { tone: "info" },
});

const ICONS = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: ExclamationCircleIcon,
} as const;

export type AlertProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof alertStyles> & {
    title?: ReactNode;
    /**
     * `assertive` interrupts screen readers (errors that need action now);
     * `polite` waits. Defaults: danger → assertive, others → polite.
     */
    urgency?: "polite" | "assertive";
  };

/** Alert: an inline message about the current task (form errors, confirmations). */
export function Alert({ tone = "info", title, urgency, className, children, ...props }: AlertProps) {
  const styles = alertStyles({ tone });
  const Icon = ICONS[tone];
  const assertive = (urgency ?? (tone === "danger" ? "assertive" : "polite")) === "assertive";
  return (
    <div {...props} role={assertive ? "alert" : "status"} className={styles.root({ class: className })}>
      <Icon aria-hidden="true" className={styles.icon()} />
      <div className={styles.body()}>
        {title ? <p className={styles.title()}>{title}</p> : null}
        {children}
      </div>
    </div>
  );
}
