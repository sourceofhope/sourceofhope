import { ComponentType, ReactNode, SVGProps } from "react";
import { LinkButton } from "@/components/ui/Button";
import Title from "@/components/ui/Title";

interface CallToActionSectionProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  children: ReactNode;
  href: string;
  buttonText: string;
}

/** Full-width closing call-to-action band shared across pages. */
export default function CallToActionSection({
  icon: IconComponent,
  title,
  children,
  href,
  buttonText,
}: CallToActionSectionProps) {
  return (
    <section className="py-15 px-5 md:px-15 lg:px-35 w-full grid justify-items-center bg-accent-800 text-neutral-50">
      <article className="md:w-2/3 lg:w-1/2 grid gap-5 justify-items-center text-balance text-center">
        <IconComponent className="w-16 h-16" aria-hidden="true" />
        <Title className="text-neutral-50">{title}</Title>
        <p className="text-sm md:text-md lg:text-lg text-neutral-300">
          {children}
        </p>
        <div className="w-fit pt-2">
          <LinkButton href={href} text={buttonText} />
        </div>
      </article>
    </section>
  );
}
