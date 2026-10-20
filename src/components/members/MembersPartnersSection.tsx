import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { GiftIcon, StarIcon } from "@heroicons/react/24/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import {
  COMMUNITY_PARTNERS,
  CommunityPartner,
} from "@/lib/community-partners";

export default function MembersPartnersSection() {
  return (
    <PageSection id="community-partners" className="bg-neutral-200 py-15">
      <SectionHeading
        eyebrow="Our Community Partners"
        title="Shop with businesses that give back">
        These local businesses support our mission. Use their HOPE code or
        mention The Source of Hope, and part of your purchase comes back to
        families in DFW.
      </SectionHeading>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMMUNITY_PARTNERS.map((partner) => (
          <li key={partner.name} className="grid">
            <PartnerCard partner={partner} />
          </li>
        ))}
      </ul>

      <article className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center rounded-2xl bg-neutral-50 shadow-sm p-5 md:p-8">
        <div className="grid gap-2">
          <h3 className="font-urbanist font-bold text-xlg text-primary-800">
            Own a local business?
          </h3>
          <p className="text-neutral-600 max-w-[65ch]">
            Become a Community Partner. Donate gift cards to welcome new
            sponsors or offer a HOPE code, and we&apos;ll introduce your
            business to supporters who choose businesses that give back.
          </p>
        </div>
        <div className="w-fit">
          <LinkButton href="#partner-inquiry" text="BECOME A PARTNER" />
        </div>
      </article>
    </PageSection>
  );
}

function PartnerCard({ partner }: { partner: CommunityPartner }) {
  const { name, action, code, note, url, givesGiftCards, foundingSponsor } =
    partner;

  const body = (
    <>
      {(foundingSponsor || givesGiftCards) && (
        <div className="flex flex-wrap gap-2">
          {foundingSponsor && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-800 px-3 py-1 text-xs font-semibold text-neutral-50">
              <StarIcon className="w-4 h-4" aria-hidden="true" />
              Founding Sponsor
            </span>
          )}
          {givesGiftCards && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-800">
              <GiftIcon className="w-4 h-4" aria-hidden="true" />
              Welcome gift partner
            </span>
          )}
        </div>
      )}
      <h3 className="font-urbanist font-bold text-lg text-primary-800">
        {name}
      </h3>
      <div className="grid gap-1 text-sm text-neutral-600">
        {code && (
          <p>
            Use code{" "}
            <span className="rounded-md bg-neutral-200 px-2 py-0.5 font-mono font-semibold text-neutral-900">
              {code}
            </span>
          </p>
        )}
        {note && <p className="italic">{note}</p>}
      </div>
      {url && (
        <span className="mt-auto inline-flex w-fit items-center gap-1 text-sm font-semibold text-accent-600">
          {action ?? "Visit"}
          <ArrowUpRightIcon
            className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </span>
      )}
    </>
  );

  const cardClass =
    "group grid content-start gap-3 h-full rounded-2xl bg-neutral-50 shadow-sm p-5";

  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardClass} no-underline! transition-shadow hover:shadow-md`}>
      {body}
    </a>
  ) : (
    <article className={cardClass}>{body}</article>
  );
}
