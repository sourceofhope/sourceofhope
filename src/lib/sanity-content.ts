import "server-only";

import { client } from "@/lib/sanity-client";

const options = { next: { revalidate: 30 } };

export interface SanityImage {
  sourceUrl?: string;
  altText?: string;
}

export interface SanityEvent {
  id: string;
  externalId?: number;
  title: string;
  date?: string;
  isOutdated?: boolean;
  location?: string;
  summary?: string;
  eventPage?: {
    url?: string;
  };
  image?: SanityImage;
}

export interface SanityProduct {
  id: string;
  externalId?: number;
  slug: string;
  title: string;
  price?: number;
  shortDescription?: string;
  longDescription?: string;
  impact?: string;
  size?: string;
  image?: SanityImage;
}

export interface SanityPublication {
  id: string;
  externalId?: number;
  title: string;
  date?: string;
  summary?: string;
  url?: string;
  image?: SanityImage;
}

export interface SanityNewsletter {
  id: string;
  externalId?: number;
  title: string;
  url?: string;
  image?: SanityImage;
}

export interface SanityTeamMember {
  _id: string;
  name: string;
  slug: { current: string };
  title?: string;
  shortBio?: string;
  bio?: string;
  image?: SanityImage;
  teamGroup?: {
    _id?: string;
    name?: string;
  };
}

export interface SanityTeamGroup {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  members: SanityTeamMember[];
}

export interface CheckoutProvider {
  id: string;
  providerId: string;
  name: string;
  description?: string;
  enabled: boolean;
  icon?: string;
}

export interface BannerEvent {
  enabled?: boolean;
  text?: string;
  link?: {
    url?: string;
  };
  expires?: string;
}

const IMAGE_PROJECTION = `
  "image": image{
    "sourceUrl": asset->url,
    "altText": alt
  }
`;

const PRODUCT_FIELDS = `
  "id": coalesce(string(externalId), _id),
  "externalId": externalId,
  "slug": slug.current,
  "title": title,
  "price": price,
  "shortDescription": shortDescription,
  "longDescription": longDescription,
  "impact": impact,
  "size": size,
  ${IMAGE_PROJECTION}
`;

const EVENT_FIELDS = `
  "id": coalesce(string(externalId), _id),
  "externalId": externalId,
  "title": title,
  "date": date,
  "isOutdated": dateTime(date) < dateTime(now()),
  "location": location,
  "summary": summary,
  "eventPage": {
    "url": eventPage.url
  },
  ${IMAGE_PROJECTION}
`;

const PUBLICATION_FIELDS = `
  "id": coalesce(string(externalId), _id),
  "externalId": externalId,
  "title": title,
  "date": date,
  "summary": summary,
  "url": url,
  ${IMAGE_PROJECTION}
`;

const NEWSLETTER_FIELDS = `
  "id": coalesce(string(externalId), _id),
  "externalId": externalId,
  "title": title,
  "url": url,
  ${IMAGE_PROJECTION}
`;

export async function fetchFeaturedEvents(limit = 12) {
  return client.fetch<SanityEvent[]>(
    `*[_type == "featuredEvent"] | order(date desc)[0...${limit}] { ${EVENT_FIELDS} }`,
    {},
    options,
  );
}

export async function fetchRecurringEvents(limit = 3) {
  return client.fetch<SanityEvent[]>(
    `*[_type == "recurringEvent"] | order(date desc)[0...${limit}] { ${EVENT_FIELDS} }`,
    {},
    options,
  );
}

export async function fetchProducts(limit?: number) {
  const slice = typeof limit === "number" ? `[0...${limit}]` : "";

  return client.fetch<SanityProduct[]>(
    `*[_type == "product"] | order(_createdAt desc) ${slice} { ${PRODUCT_FIELDS} }`,
    {},
    options,
  );
}

export async function fetchProductById(id: string) {
  return client.fetch<SanityProduct | null>(
    `*[_type == "product" && (slug.current == $id || string(externalId) == $id || _id == $id)][0] {
      ${PRODUCT_FIELDS}
    }`,
    { id },
    options,
  );
}

export async function fetchPublications(limit = 12) {
  return client.fetch<SanityPublication[]>(
    `*[_type == "publication"] | order(date desc)[0...${limit}] { ${PUBLICATION_FIELDS} }`,
    {},
    options,
  );
}

export async function fetchNewsletters(limit = 12) {
  return client.fetch<SanityNewsletter[]>(
    `*[_type == "newsletter"] | order(_createdAt desc)[0...${limit}] { ${NEWSLETTER_FIELDS} }`,
    {},
    options,
  );
}

export async function fetchTeamGroupsWithMembers() {
  return client.fetch<SanityTeamGroup[]>(
    `*[_type == "teamGroup"] {
      _id,
      name,
      slug,
      description,
      "members": *[_type == "teamMember" && teamGroup._ref == ^._id] | order(name asc) {
        _id,
        name,
        slug,
        title,
        shortBio,
        bio,
        ${IMAGE_PROJECTION},
        teamGroup->{
          _id,
          name
        }
      }
    }`,
    {},
    options,
  );
}

export async function fetchTeamMemberBySlug(slug: string) {
  return client.fetch<SanityTeamMember | null>(
    `*[_type == "teamMember" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      title,
      shortBio,
      bio,
      ${IMAGE_PROJECTION},
      teamGroup->{
        _id,
        name
      }
    }`,
    { slug },
    options,
  );
}

export async function fetchCheckoutProviders() {
  return client.fetch<CheckoutProvider[]>(
    `*[_type == "checkoutProvider"] | order(name asc) {
      "id": _id,
      providerId,
      name,
      description,
      enabled,
      icon
    }`,
    {},
    options,
  );
}

export async function fetchBannerEvents() {
  return client.fetch<BannerEvent[]>(
    `*[_type == "bannerEvent"] | order(_createdAt desc) {
      enabled,
      text,
      "link": {
        "url": link.url
      },
      expires
    }`,
    {},
    options,
  );
}
