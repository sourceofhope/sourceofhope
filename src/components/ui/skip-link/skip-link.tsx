import { useTranslations } from "next-intl";
import { focusRing, tv } from "../lib/tv";

const skipLinkStyles = tv({
  base: [
    "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-toast)",
    "rounded-md bg-surface px-4 py-3 font-semibold text-ink shadow-overlay",
    focusRing.default,
  ],
});

/**
 * SkipLink: the first focusable element on every page (spec §12). Jumps to
 * `<main id="main">`, which every page template provides.
 */
export function SkipLink() {
  const t = useTranslations("UI");
  return (
    <a href="#main" className={skipLinkStyles()}>
      {t("skipToContent")}
    </a>
  );
}
