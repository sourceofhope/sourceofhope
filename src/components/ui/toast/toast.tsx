"use client";

import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  createToaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion as SdkToastRegion,
  ToastTitle,
} from "@ui-sdk/react/toast";
import { useTranslations } from "next-intl";
import { buttonStyles } from "../button/button.styles";
import { tv } from "../lib/tv";

/**
 * The one toast queue for the whole site. Call `toast.success("Saved")` from
 * any client component; the single ToastRegion in the root layout shows it.
 * Toasts are for confirmations that don't need a decision. Errors that block
 * the user belong in an Alert next to the problem, not a toast.
 */
export const toast = createToaster();

const toastStyles = tv({
  slots: {
    // translate-none: the SDK centers with left 50% + translate; we center with inset + mx-auto.
    region: "fixed inset-x-4 bottom-4 z-(--z-toast) mx-auto flex max-w-sm translate-none flex-col-reverse gap-2 outline-none",
    item: [
      "flex items-start gap-3 rounded-md border border-line bg-surface p-4 text-ink shadow-overlay select-none",
      "translate-y-(--toast-swipe-y) transition duration-(--duration-slow) ease-standard motion-reduce:transition-none",
      "data-starting-style:translate-y-4 data-starting-style:opacity-0 data-ending-style:opacity-0 data-swiping:transition-none",
      "[&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0",
      "data-[type=success]:[&>svg]:text-success data-[type=error]:[&>svg]:text-danger data-[type=warning]:[&>svg]:text-warning data-[type=info]:[&>svg]:text-info",
    ],
    text: "flex flex-1 flex-col gap-0.5",
    title: "font-semibold",
    description: "text-sm text-ink-soft",
  },
});

const ICONS = {
  success: CheckCircleIcon,
  error: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
} as const;

/** ToastRegion: mount once, in the root layout. */
export function ToastRegion() {
  const t = useTranslations("UI");
  const s = toastStyles();
  return (
    <SdkToastRegion toaster={toast} side="bottom" align="center" maxVisible={3} pendingAnnouncement={t("working")} className={s.region()}>
      {({ type }) => {
        const Icon = type in ICONS ? ICONS[type as keyof typeof ICONS] : null;
        return (
          <Toast className={s.item()}>
            {Icon ? <Icon aria-hidden="true" /> : null}
            <div className={s.text()}>
              <ToastTitle className={s.title()} />
              <ToastDescription className={s.description()} />
            </div>
            <ToastAction className={buttonStyles({ variant: "secondary", size: "sm" })} />
            <ToastClose aria-label={t("dismiss")} className={buttonStyles({ variant: "tertiary", size: "sm", iconOnly: true })}>
              <XMarkIcon aria-hidden="true" />
            </ToastClose>
          </Toast>
        );
      }}
    </SdkToastRegion>
  );
}
