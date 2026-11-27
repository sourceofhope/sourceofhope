import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { NewsletterForm } from "@/components/layout/site-footer";
import { ListingTemplate } from "@/components/layout/templates";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { ExternalLink } from "@/components/ui/link";
import { YouTubeEmbed } from "@/components/ui/youtube-embed";
import { PODCAST, PRESS_VIDEOS, RADIO } from "@/content/media";
import { StoryCard } from "@/features/stories/story-card";
import { formatDate } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { getNewsletters, getStories } from "@/lib/content/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Media");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("title"), description: t("meta"), alternates: localeAlternates("/media", locale) };
}

/* News & Media (spec §10.7): stories, press, podcast, newsletter archive and sign-up. */
export default async function MediaPage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Media");
  const [stories, newsletters] = await Promise.all([getStories(12, locale), getNewsletters(12, locale)]);

  return (
    <ListingTemplate header={{ title: t("title"), lead: t("lead") }}>
      <div className="flex flex-col gap-section">
        <section id="stories" aria-labelledby="stories-title" className="flex scroll-mt-24 flex-col gap-6">
          <Heading level={2} size="2xl" id="stories-title">
            {t("stories")}
          </Heading>
          {stories.length ? (
            <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <StoryCard key={story.url} story={story} />
              ))}
            </ul>
          ) : (
            <EmptyState level={3} title={t("storiesEmpty")} />
          )}
        </section>

        <section id="press" aria-labelledby="press-title" className="flex scroll-mt-24 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Heading level={2} size="2xl" id="press-title">
              {t("press")}
            </Heading>
            <p className="text-lg text-muted">{t("pressLead")}</p>
          </div>
          <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-2">
            {PRESS_VIDEOS.map((video) => (
              <li key={video.id} className="flex flex-col gap-3">
                <YouTubeEmbed id={video.id} title={video.title} />
                <Heading level={3} size="xl">
                  {video.title}
                </Heading>
              </li>
            ))}
          </ul>
        </section>

        <section id="podcast" aria-labelledby="podcast-title" className="flex scroll-mt-24 flex-col gap-6">
          <Heading level={2} size="2xl" id="podcast-title">
            {t("podcast")}
          </Heading>
          <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-2">
            <Card as="li">
              <div className="flex h-full flex-col gap-3 p-6">
                <Heading level={3} size="xl">
                  {PODCAST.name}
                </Heading>
                <p className="text-ink-soft">{PODCAST.description}</p>
                <div className="mt-auto pt-2">
                  <ExternalLink href={PODCAST.spotify} newTab>
                    {t("listen")}
                  </ExternalLink>
                </div>
              </div>
            </Card>
            <Card as="li">
              <div className="flex h-full flex-col gap-3 p-6">
                <Heading level={3} size="xl">
                  {RADIO.name}
                </Heading>
                <p className="text-ink-soft">{RADIO.description}</p>
                <div className="flex flex-col gap-1 rounded-md bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-muted">{t("radioLabel")}</p>
                  {RADIO.vietnamese.map((line) => (
                    <p key={line} lang="vi" className="text-ink">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-auto pt-2">
                  <ExternalLink href={RADIO.playlist} newTab>
                    {t("watch")}
                  </ExternalLink>
                </div>
              </div>
            </Card>
          </ul>
        </section>

        {newsletters.length ? (
          <section id="newsletters" aria-labelledby="newsletters-title" className="flex scroll-mt-24 flex-col gap-6">
            <Heading level={2} size="2xl" id="newsletters-title">
              {t("newsletters")}
            </Heading>
            <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {newsletters.map((issue) => (
                <Card key={issue.url} as="li">
                  {issue.image ? <Image src={issue.image.src} alt="" width={issue.image.width} height={issue.image.height} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-3/4 w-full object-cover" /> : null}
                  <div className="flex flex-col gap-2 p-4">
                    <Heading level={3} size="xl">
                      {issue.title}
                    </Heading>
                    {issue.date ? <p className="text-sm text-muted">{formatDate(new Date(`${issue.date.slice(0, 10)}T12:00:00Z`), locale, "long")}</p> : null}
                    <ExternalLink href={issue.url as `https://${string}`} newTab>
                      {t("newsletterOpen")}
                    </ExternalLink>
                  </div>
                </Card>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="mt-section rounded-lg bg-surface-muted p-6 md:p-8">
        <section id="newsletter" aria-labelledby="newsletter-signup" className="grid scroll-mt-24 gap-6 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-2">
              <Heading level={2} size="2xl" id="newsletter-signup">
                {t("signupTitle")}
              </Heading>
              <p className="text-lg text-muted">{t("signupText")}</p>
            </div>
            <NewsletterForm />
        </section>
      </div>
    </ListingTemplate>
  );
}
