import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { TextLink } from "@/components/ui/link";
import { Container } from "../container";

export type PageImage = { src: string; alt: string; width: number; height: number };
export type BackLink = { href: string; label: string };

export type PageHeaderProps = {
  /** The page's one h1. Always from this prop; children never replace it (spec §7). */
  title: string;
  eyebrow?: string;
  /** One or two sentences under the title. */
  lead?: ReactNode;
  /** A photo beside the title on wide screens, above it on phones. */
  image?: PageImage;
  /** Buttons under the lead (Hub actions on Program pages). */
  actions?: ReactNode;
  /** A link back to the parent list (Detail pages). */
  back?: BackLink;
  /** `lg` for Program heroes; `md` for every other page. */
  size?: "md" | "lg";
};

/** BackLink: "← All team members". Sits above a Detail page's h1. */
export function BackLinkRow({ href, label }: BackLink) {
  return (
    <TextLink href={href} quiet className="inline-flex min-h-11 items-center gap-1.5 [&_svg]:size-5">
      <ArrowLeftIcon aria-hidden="true" />
      {label}
    </TextLink>
  );
}

/**
 * PageHeader: the top of every Content, Listing and Program page. It owns
 * the h1, so a page can't ship without one or with two.
 */
export function PageHeader({ title, eyebrow, lead, image, actions, back, size = "md" }: PageHeaderProps) {
  return (
    <header className="bg-surface-muted py-section-sm">
      <Container>
        {back ? (
          <div className="mb-4">
            <BackLinkRow {...back} />
          </div>
        ) : null}
        <div className={image ? "grid items-center gap-8 md:grid-cols-2 lg:gap-12" : undefined}>
          <div className="flex max-w-prose flex-col gap-4">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <Heading level={1} size={size === "lg" ? "5xl" : "4xl"}>
              {title}
            </Heading>
            {lead ? <div className="text-lg text-ink-soft md:text-xl">{lead}</div> : null}
            {actions ? <div className="mt-2 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              radius="lg"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="order-first aspect-4/3 w-full object-cover md:order-last"
            />
          ) : null}
        </div>
      </Container>
    </header>
  );
}
