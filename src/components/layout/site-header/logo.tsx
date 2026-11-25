import { focusRing } from "@/components/ui/lib/tv";
import { Image } from "@/components/ui/image";
import { ORGANIZATION } from "@/content/organization";
import { Link } from "@/i18n/navigation";

/**
 * Logo: the dove mark with the name set in Urbanist, linking home. Text,
 * not the stacked image, so it reads on the solid header, over the hero
 * video and on the navy footer. `compact` hides the name on small phones;
 * it stays the link's accessible name.
 */
export function Logo({ surface = "default", compact }: { surface?: "default" | "inverse"; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm transition-colors duration-(--duration-base) motion-reduce:transition-none ${surface === "inverse" ? `text-on-inverse ${focusRing.inverse}` : `text-ink ${focusRing.default}`}`}
    >
      <Image src="/v2/core/TSOH-Favicon.webp" alt="" width={40} height={40} className="size-10 object-contain" />
      <span className={`font-heading text-lg leading-tight font-bold ${compact ? "max-sm:sr-only" : ""}`}>{ORGANIZATION.name}</span>
    </Link>
  );
}
