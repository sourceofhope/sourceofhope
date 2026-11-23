import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { Link } from "@/i18n/navigation";
import { VisuallyHidden } from "../visually-hidden";
import { linkStyles, type LinkStyleProps } from "./link.styles";

/** TextLink: an internal link in text (locale-aware). For external sites use ExternalLink. */
export type TextLinkProps = ComponentProps<typeof Link> & LinkStyleProps;

export function TextLink({ surface, quiet, className, ...props }: TextLinkProps) {
  return <Link {...props} className={linkStyles({ surface, quiet, class: className })} />;
}

/**
 * ExternalLink: a link to another site, email or phone. Shows ↗ and, when it
 * opens a new tab, tells screen readers so (spec §5.7).
 */
export type ExternalLinkProps = Omit<ComponentProps<"a">, "href" | "target" | "rel"> &
  LinkStyleProps & {
    href: `https://${string}` | `http://${string}` | `mailto:${string}` | `tel:${string}`;
    /** Open in a new tab. Off by default; use for documents and partner sites. */
    newTab?: boolean;
  };

export function ExternalLink({ href, newTab, surface, quiet, className, children, ...props }: ExternalLinkProps) {
  const t = useTranslations("UI");
  const isWeb = href.startsWith("http");
  return (
    <a
      {...props}
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={linkStyles({ surface, quiet, class: className })}
    >
      {children}
      {isWeb ? <ArrowUpRightIcon aria-hidden="true" /> : null}
      {newTab ? <VisuallyHidden> {t("opensInNewTab")}</VisuallyHidden> : null}
    </a>
  );
}
