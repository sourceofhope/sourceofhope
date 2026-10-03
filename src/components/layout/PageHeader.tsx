import Image from "next/image";
import { ReactNode } from "react";
import { ASSET_VERSION } from "@/lib/environment";

interface PageHeaderProps {
  /** Page title, rendered as the page's single <h1>. */
  title?: string;
  /** Short uppercase tagline shown beneath the title. */
  subtitle?: string;
  /** Background image (local /public path or allowed remote host). */
  src?: string;
  /** CSS object-position for the background, e.g. "50% 30%". */
  position?: string;
  /** Extra content rendered below the title/subtitle. */
  children?: ReactNode;
  className?: string;
}

/**
 * Consistent page banner used at the top of every primary page.
 *
 * Height, gutters, and typography are fixed here so that every page frames
 * its title the same way — pages should pass `title`/`subtitle` rather than
 * styling their own headings.
 */
export default function PageHeader({
  title,
  subtitle,
  src = `/${ASSET_VERSION}/core/TSOH-Family.webp`,
  position = "center",
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`relative isolate flex items-end w-full h-100 md:h-110 mb-10 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover brightness-[.6] contrast-[1.1] [mask-image:linear-gradient(to_bottom,white_82%,transparent_100%)]"
        style={{ objectPosition: position }}
      />
      <div className="w-full grid gap-1 px-5 md:px-15 lg:px-35 pb-18 md:pb-22">
        {title && (
          <h1 className="font-urbanist font-bold text-neutral-50 text-xxlg md:text-xxxlg leading-tight text-balance">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="font-semibold text-neutral-200 text-sm tracking-wide">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
