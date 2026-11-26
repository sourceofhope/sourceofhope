import type {StructureResolver} from 'sanity/structure'
import {SINGLETONS} from './schemaTypes/v2'

const SINGLETON_TITLES: Record<(typeof SINGLETONS)[number], string> = {
  siteSettings: 'Site settings',
  ourStory: 'Our Story',
  plannedGiving: 'Planned giving',
  sponsorTiers: 'Sponsor tiers',
}

/**
 * The v2 Studio menu (slice 2.5): settings and one-off pages first, then
 * content grouped the way staff think about it. Singletons open directly,
 * so there's never a second copy.
 */
export const structureV2: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...SINGLETONS.map((type) => S.listItem().title(SINGLETON_TITLES[type]).id(type).child(S.document().schemaType(type).documentId(type))),
      S.divider(),
      S.documentTypeListItem('program').title('Programs'),
      S.documentTypeListItem('service').title('Get Help services'),
      S.documentTypeListItem('faq').title('Questions and answers'),
      S.documentTypeListItem('recurringProgram').title('Recurring programs'),
      S.divider(),
      S.listItem()
        .title('Team')
        .child(S.list().title('Team').items([S.documentTypeListItem('teamGroup').title('Groups'), S.documentTypeListItem('teamMember').title('Members')])),
      S.listItem()
        .title('News & Media')
        .child(S.list().title('News & Media').items([S.documentTypeListItem('publication').title('Stories and updates'), S.documentTypeListItem('newsletter').title('Newsletter issues')])),
      S.listItem()
        .title('Store')
        .child(S.list().title('Store').items([S.documentTypeListItem('product').title('Products'), S.documentTypeListItem('checkoutProvider').title('Checkout providers')])),
    ])
