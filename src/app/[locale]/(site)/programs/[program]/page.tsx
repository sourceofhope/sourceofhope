import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { HubLinkButton } from "@/components/layout/hub-link";
import { Prose } from "@/components/layout/prose";
import { ProgramTemplate } from "@/components/layout/templates";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { EmptyState } from "@/components/ui/empty-state";
import { Image } from "@/components/ui/image";
import { LinkButton } from "@/components/ui/button";
import { PROGRAM_FAQS } from "@/content/faqs";
import { PROGRAM_KEYS, type ProgramKey } from "@/content/programs";
import { EventCard } from "@/features/events/event-card";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { eventImage, getProgram } from "@/lib/content/loaders";
import { getUpcomingEvents } from "@/lib/db/events";

type Props = { params: Promise<{ program: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRAM_KEYS.map((program) => ({ program }));
}

const isProgramKey = (value: string): value is ProgramKey => (PROGRAM_KEYS as readonly string[]).includes(value);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { program: key } = await params;
  if (!isProgramKey(key)) return {};
  const locale = (await getLocale()) as AppLocale;
  const program = await getProgram(key, locale);
  return {
    title: program.name,
    description: program.summary,
    alternates: localeAlternates(`/programs/${key}`, locale),
    openGraph: { title: program.name, description: program.summary, images: [program.image.src] },
  };
}

/* A program page (spec §10.3), on the Program template. */
export default async function ProgramPage({ params }: Props) {
  const { program: key } = await params;
  if (!isProgramKey(key)) notFound();
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Programs");
  const [program, events] = await Promise.all([getProgram(key, locale), getUpcomingEvents({ locale: locale.slice(0, 2), programKey: key, limit: 6 })]);
  const faqs = PROGRAM_FAQS[key] ?? [];

  const helpButtons = (surface: "default" | "inverse" = "default") => (
    <>
      <HubLinkButton hub={{ action: "volunteer", program: key }} surface={surface}>
        {t("volunteer")}
      </HubLinkButton>
      <HubLinkButton hub={{ action: "give", designation: key }} variant="secondary" surface={surface}>
        {t("give")}
      </HubLinkButton>
      {program.participantNeed ? (
        <HubLinkButton hub={{ action: "help", need: program.participantNeed }} variant="tertiary" surface={surface} withIcon>
          {t("getHelp")}
        </HubLinkButton>
      ) : null}
    </>
  );

  return (
    <ProgramTemplate
      header={{ title: program.name, summary: program.summary, image: program.image, actions: helpButtons("default") }}
      about={
        <Prose>
          {program.about.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </Prose>
      }
      audience={program.audience ? <p className="max-w-prose text-lg text-ink-soft">{program.audience}</p> : undefined}
      schedule={program.schedule ? <p className="max-w-prose text-lg text-ink-soft">{program.schedule}</p> : undefined}
      events={
        events.length ? (
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} image={eventImage(event)} />
            ))}
          </ul>
        ) : (
          <EmptyState
            level={3}
            title={t("eventsEmpty")}
            action={
              <LinkButton href="/events" variant="secondary">
                {t("seeAllEvents")}
              </LinkButton>
            }
          />
        )
      }
      help={
        <div className="flex flex-col gap-6">
          <p className="max-w-prose text-lg text-ink-soft">{t("helpLead", { program: program.name })}</p>
          <div className="flex flex-wrap gap-3">{helpButtons("default")}</div>
        </div>
      }
      gallery={
        program.gallery.length ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-4">
            {program.gallery.map((photo, i) => (
              <li key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt || t("galleryPhoto", { n: i + 1, total: program.gallery.length })}
                  width={photo.width}
                  height={photo.height}
                  radius="md"
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="aspect-square w-full object-cover"
                />
              </li>
            ))}
          </ul>
        ) : undefined
      }
      faq={
        faqs.length ? (
          <Accordion>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} title={faq.question} level={3}>
                <Prose>
                  {faq.answer.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </Prose>
              </AccordionItem>
            ))}
          </Accordion>
        ) : undefined
      }
    />
  );
}
