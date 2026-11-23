import type { ReactNode } from "react";
import { Heading, type HeadingProps } from "../heading";
import { tv } from "../lib/tv";

const emptyStateStyles = tv({
  slots: {
    root: "flex flex-col items-center gap-3 rounded-md bg-surface-muted px-6 py-10 text-center",
    icon: "text-muted [&_svg]:size-8",
    body: "max-w-prose text-muted",
  },
});

export type EmptyStateProps = {
  title: string;
  /** Heading level for the title, so the page outline stays correct. */
  level: HeadingProps["level"];
  icon?: ReactNode;
  children?: ReactNode;
  /** What to do next: a LinkButton, Button or TextLink. */
  action?: ReactNode;
  className?: string;
};

/** EmptyState: nothing to show yet, and what the visitor can do instead (spec §9.8). */
export function EmptyState({ title, level, icon, children, action, className }: EmptyStateProps) {
  const s = emptyStateStyles();
  return (
    <div className={s.root({ class: className })}>
      {icon ? (
        <span aria-hidden="true" className={s.icon()}>
          {icon}
        </span>
      ) : null}
      <Heading level={level} size="xl">
        {title}
      </Heading>
      {children ? <div className={s.body()}>{children}</div> : null}
      {action}
    </div>
  );
}
