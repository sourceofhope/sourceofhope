/**
 * Local businesses that give back to The Source of Hope. Listed on /store
 * ("Shop Beyond Our Store") and /members ("Shop with businesses that give back").
 * Business sponsors who opt in to a website listing are added here too.
 */
export interface CommunityPartner {
  name: string;
  /** Short call to action, e.g. "Reserve a Table". */
  action?: string;
  /** Discount code supporters use when ordering or booking. */
  code?: string;
  /** Shown instead of a code, e.g. how to mention us when booking. */
  note?: string;
  /** Partner website. Cards without one are not links. */
  url?: string;
  /** True while the partner donates welcome gift cards for new Community Sponsors. */
  givesGiftCards?: boolean;
  /** Joined as a Community Sponsor during the Thanksgiving 2026 launch. */
  foundingSponsor?: boolean;
}

export const COMMUNITY_PARTNERS: CommunityPartner[] = [
  {
    name: "12 Cuts Brazilian Steakhouse",
    action: "Reserve a Table",
    code: "SOURCEOFHOPE",
  },
  {
    name: "Local Spa & Beauty Services",
    action: "Visit Now",
    code: "HOPEGLOW",
  },
  {
    name: "Stone Global Realty",
    action: "Learn More",
    note: "Mention 'The Source of Hope' when booking",
  },
  {
    name: "Stone Construction",
    action: "Learn More",
    note: "Mention 'The Source of Hope' when booking",
  },
  {
    name: "Stone International Wellness Center",
    action: "Book Now",
    code: "HOPEWELLNESS10",
  },
];

/** Monthly amount (USD) at which new sponsors receive a partner welcome gift card. */
export const WELCOME_GIFT_MIN_MONTHLY = 25;
