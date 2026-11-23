import type { ComponentProps, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Spinner } from "../spinner";
import { VisuallyHidden } from "../visually-hidden";
import { buttonStyles, type ButtonStyleProps } from "./button.styles";

/**
 * Button: an action on this page (submit, open, toggle).
 * Use LinkButton to go somewhere, IconButton when there is no visible text.
 */
export type ButtonProps = Omit<ComponentProps<"button">, "type"> &
  ButtonStyleProps & {
    /** Required, so a button inside a form never submits by accident. */
    type: "button" | "submit" | "reset";
    /** Shows a spinner, disables the button and announces "Working…". */
    loading?: boolean;
  };

export function Button({ variant, size, surface, fullWidth, loading, disabled, className, children, ...props }: ButtonProps) {
  const t = useTranslations("UI");
  return (
    // `type` is required by ButtonProps, so TypeScript guarantees it; the
    // lint rule can't see through the spread.
    // eslint-disable-next-line react/button-has-type
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, surface, fullWidth, class: className })}
    >
      {loading ? <Spinner /> : null}
      {children}
      {loading ? <VisuallyHidden>{t("working")}</VisuallyHidden> : null}
    </button>
  );
}

/**
 * LinkButton: navigation styled as a button (Volunteer, Give, Learn more).
 * Internal routes only; it uses the locale-aware Link.
 */
export type LinkButtonProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function LinkButton({ variant, size, surface, fullWidth, className, ...props }: LinkButtonProps) {
  return <Link {...props} className={buttonStyles({ variant, size, surface, fullWidth, class: className })} />;
}

/**
 * IconButton: a button with only an icon. `label` is required and becomes
 * its accessible name (spec §5.7).
 */
export type IconButtonProps = Omit<ComponentProps<"button">, "type" | "aria-label" | "children"> &
  Omit<ButtonStyleProps, "fullWidth"> & {
    type?: "button" | "submit";
    label: string;
    icon: ReactNode;
  };

export function IconButton({ variant = "tertiary", size, surface, label, icon, type = "button", className, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      // `type` is typed as "button" | "submit" with a "button" default.
      // eslint-disable-next-line react/button-has-type
      type={type}
      aria-label={label}
      className={buttonStyles({ variant, size, surface, iconOnly: true, class: className })}
    >
      {icon}
    </button>
  );
}
