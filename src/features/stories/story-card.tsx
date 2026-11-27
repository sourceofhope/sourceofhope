import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { formatDate } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import type { Story } from "@/lib/content/loaders";
import { focusRing } from "@/components/ui/lib/tv";

/** StoryCard: a story or update that lives on another site (news, partner posts). */
export function StoryCard({ story, level = 3 }: { story: Story; level?: 2 | 3 }) {
  const t = useTranslations("Programs");
  const locale = useLocale() as AppLocale;
  return (
    <Card as="li" interactive>
      {story.image ? (
        <Image src={story.image.src} alt="" width={story.image.width} height={story.image.height} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-video w-full object-cover" />
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {story.date ? <p className="text-sm text-muted">{formatDate(new Date(`${story.date.slice(0, 10)}T12:00:00Z`), locale, "long")}</p> : null}
        <Heading level={level} size="xl">
          <a href={story.url} className={`rounded-sm text-ink no-underline after:absolute after:inset-0 hover:underline ${focusRing.default}`}>
            {story.title}
          </a>
        </Heading>
        {story.summary ? <p className="line-clamp-3 text-ink-soft">{story.summary}</p> : null}
        <p className="mt-auto pt-2 font-semibold text-action" aria-hidden="true">
          {t("readStory")}
        </p>
      </div>
    </Card>
  );
}
