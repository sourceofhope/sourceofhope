"use client";

import type { ReactElement, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Dialog as SdkDialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { buttonStyles } from "../button/button.styles";
import { VisuallyHidden } from "../visually-hidden";
import { dialogStyles, type DialogLayout } from "./dialog.styles";

export type DialogProps = {
  /** Controlled open state (the Hub drives this from the URL). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name. Always required; hide it visually with `hideTitle`. */
  title: ReactNode;
  hideTitle?: boolean;
  description?: ReactNode;
  layout?: DialogLayout;
  /** Content shown in place of the title row (Hub door tabs, step header). */
  header?: ReactNode;
  /** A sticky action bar (spec §9.2). */
  footer?: ReactNode;
  /** An element that opens the dialog (uncontrolled use). */
  trigger?: ReactElement;
  /** Escape and backdrop presses close it. Turn off while a payment runs. */
  dismissible?: boolean;
  children: ReactNode;
};

/**
 * Dialog: the one modal for everything (spec §6). Focus moves in and is
 * trapped, Escape closes, focus returns to the trigger, the page behind is
 * inert and scroll-locked. A swipe never closes it (spec §9.3).
 */
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  title,
  hideTitle,
  description,
  layout = "dialog",
  header,
  footer,
  trigger,
  dismissible = true,
  children,
}: DialogProps) {
  const t = useTranslations("UI");
  const s = dialogStyles({ layout });
  const titleNode = <DialogTitle className={s.title()}>{title}</DialogTitle>;

  return (
    <SdkDialog
      open={open}
      defaultOpen={defaultOpen}
      dismissible={dismissible}
      onOpenChange={(next, details) => {
        if (!next && details.reason === "swipe") return details.cancel();
        onOpenChange?.(next);
      }}
    >
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogBackdrop className={s.backdrop()} />
      <DialogContent className={s.content()}>
        <div className={s.header()}>
          <div className={s.titleGroup()}>
            {hideTitle ? <VisuallyHidden>{titleNode}</VisuallyHidden> : null}
            {header ?? (hideTitle ? null : titleNode)}
            {description ? <DialogDescription className={s.description()}>{description}</DialogDescription> : null}
          </div>
          <DialogClose
            aria-label={t("close")}
            className={buttonStyles({ variant: "tertiary", iconOnly: true, class: "shrink-0" })}
          >
            <XMarkIcon aria-hidden="true" />
          </DialogClose>
        </div>
        <div className={s.body()}>{children}</div>
        {footer ? <div className={s.footer()}>{footer}</div> : null}
      </DialogContent>
    </SdkDialog>
  );
}

/** Sheet: the full-screen dialog used for the mobile menu (spec §8.3). */
export function Sheet(props: Omit<DialogProps, "layout">) {
  return <Dialog {...props} layout="fullscreen" />;
}
