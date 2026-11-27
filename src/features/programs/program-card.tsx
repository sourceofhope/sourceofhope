import { useTranslations } from "next-intl";
import { Card, CardLink } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import type { ProgramContent } from "@/content/programs";

/** ProgramCard: image, name, one line and "Learn more" (Home, Programs index). */
export function ProgramCard({ program, level = 3 }: { program: ProgramContent; level?: 2 | 3 }) {
  const t = useTranslations("Programs");
  return (
    <Card as="li" interactive>
      <Image src={program.image.src} alt="" width={program.image.width} height={program.image.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-4/3 w-full object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Heading level={level} size="xl">
          <CardLink href={`/programs/${program.key}`}>{program.name}</CardLink>
        </Heading>
        <p className="text-ink-soft">{program.summary}</p>
        <p className="mt-auto pt-2 font-semibold text-action" aria-hidden="true">
          {t("learnMore")}
        </p>
      </div>
    </Card>
  );
}
