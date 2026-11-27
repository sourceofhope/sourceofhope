import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Image } from "@/components/ui/image";
import { Marquee } from "@/components/ui/marquee";
import { SPONSORS } from "@/content/sponsors";

/** The sponsor strip under the hero (spec §10.1): every sponsor equally, constant speed, pausable. */
export function SponsorStrip() {
  const t = useTranslations("Home");
  return (
    <div className="border-b border-line py-section-sm">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <h2 className="shrink-0 text-sm font-semibold tracking-wide text-muted uppercase">{t("sponsors")}</h2>
          <div className="min-w-0 flex-1">
            <Marquee label={t("sponsors")}>
              {SPONSORS.map((s) => (
                <Image key={s.name} src={s.logo} alt={s.name} width={144} height={48} className="h-12 w-36 object-contain" />
              ))}
            </Marquee>
          </div>
        </div>
      </Container>
    </div>
  );
}
