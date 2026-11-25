/**
 * Facts about The Source of Hope used in the shell (footer, menu sheet,
 * error pages). One place, so the phone number and address never drift.
 * Formats follow the glossary (spec §13.3).
 */
export type SocialNetwork = "instagram" | "facebook" | "x" | "youtube";

export const ORGANIZATION = {
  name: "The Source of Hope",
  phone: { display: "(469) 969-0244", href: "tel:+14699690244" },
  email: { display: "info@thesourceofhope.org", href: "mailto:info@thesourceofhope.org" },
  address: { street: "1108 W Parker Rd, Ste 102", city: "Plano, TX 75075" },
  ein: "46-2491772",
  candid: {
    profile: "https://app.candid.org/profile/9393304/the-source-of-hope-46-2491772",
    // Candid's seal widget currently returns an empty frame for this profile
    // (checked 2026-11-25), so the footer links the profile as text. Put the
    // seal URL back once Candid shows a seal again:
    // https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/9393304/svg
    seal: null,
  },
  // The Instagram handle is an open content task (spec §13.3); today's site links `sourceofhope`.
  social: [
    { network: "instagram", label: "Instagram", href: "https://www.instagram.com/sourceofhope/" },
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/TheSourceOfHope/" },
    { network: "x", label: "X (Twitter)", href: "https://x.com/thesourceofhope/" },
    { network: "youtube", label: "YouTube", href: "https://www.youtube.com/@thesourceofhope" },
  ],
} as const satisfies {
  name: string;
  phone: { display: string; href: `tel:${string}` };
  email: { display: string; href: `mailto:${string}` };
  candid: { profile: `https://${string}`; seal: `https://${string}` | null };
  social: readonly { network: SocialNetwork; label: string; href: `https://${string}` }[];
  address: { street: string; city: string };
  ein: string;
};
