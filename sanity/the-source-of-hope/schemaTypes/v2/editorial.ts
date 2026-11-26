import {defineArrayMember, defineField, defineType} from 'sanity'
import {internalName, localizedRichText, localizedString, localizedText, NEED_CATEGORIES, PROGRAM_KEYS, slugField} from './shared'

/*
 * Editorial types (ADR-0007): fixed fields, laid out by templates. Editors
 * fill fields; they don't arrange blocks.
 */

/** One of the five programs (spec §10.3, Program template). */
export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'sections', title: 'Page sections'},
    {name: 'help', title: 'How to help'},
  ],
  fields: [
    defineField({
      name: 'key',
      title: 'Program',
      type: 'string',
      options: {list: PROGRAM_KEYS},
      group: 'basics',
      validation: (rule) =>
        rule.required().custom(async (key, context) => {
          const id = context.document?._id.replace(/^drafts\./, '')
          const taken = await context
            .getClient({apiVersion: '2026-04-10'})
            .fetch('count(*[_type == "program" && key == $key && !(_id in [$id, "drafts." + $id])])', {key, id})
          return taken === 0 ? true : 'Another document already uses this program'
        }),
    }),
    localizedString({name: 'name', title: 'Name', description: 'Exactly as in the glossary.', group: 'basics'}),
    localizedString({name: 'summary', title: 'One line', description: 'Shown under the name and on program cards.', group: 'basics'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'accessibleImage', group: 'basics', validation: (rule) => rule.required()}),
    defineField({name: 'order', title: 'Order on the Programs page', type: 'number', group: 'basics'}),
    localizedRichText({name: 'about', title: 'What it is', group: 'sections'}),
    localizedText({name: 'audience', title: 'Who it serves', group: 'sections', required: false}),
    localizedText({name: 'schedule', title: 'When and where', group: 'sections', required: false}),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [defineArrayMember({type: 'accessibleImage'})],
      group: 'sections',
      validation: (rule) => rule.max(12),
    }),
    defineField({name: 'faqs', title: 'Questions and answers', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})], group: 'sections'}),
    defineField({
      name: 'participantNeed',
      title: 'Get Help need for participants',
      description: '"For participants" opens Get Help at this need.',
      type: 'string',
      options: {list: NEED_CATEGORIES},
      group: 'help',
    }),
    defineField({
      name: 'externalForms',
      title: 'Program forms',
      description: 'Applications and sign-ups run by the program on other sites.',
      type: 'array',
      of: [defineArrayMember({type: 'externalLink'})],
      group: 'help',
    }),
  ],
  preview: {select: {title: 'key', media: 'heroImage'}},
})

/** A Get Help service (spec §9.5). */
export const service = defineType({
  name: 'service',
  title: 'Get Help service',
  type: 'document',
  fields: [
    internalName,
    slugField(),
    defineField({name: 'need', title: 'Need', type: 'string', options: {list: NEED_CATEGORIES, layout: 'radio'}, validation: (rule) => rule.required()}),
    defineField({name: 'program', title: 'Program', type: 'string', options: {list: PROGRAM_KEYS}}),
    localizedString({name: 'name', title: 'Name'}),
    localizedText({name: 'summary', title: 'Summary', description: 'One or two short sentences. 6th–8th grade reading level.'}),
    localizedText({name: 'whoFor', title: 'Who it is for'}),
    localizedText({name: 'when', title: 'When', required: false}),
    defineField({name: 'address', title: 'Address', type: 'string'}),
    localizedText({name: 'bring', title: 'What to bring', required: false}),
    localizedString({name: 'cost', title: 'Cost', required: false}),
    defineField({
      name: 'howToStart',
      title: 'How to start',
      type: 'string',
      options: {list: [{title: 'Call us', value: 'call'}, {title: 'Apply online', value: 'apply'}, {title: 'Just come', value: 'come'}, {title: 'Email or call', value: 'contact'}], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'applyLink',
      title: 'Application link',
      type: 'externalLink',
      hidden: ({parent}) => (parent as {howToStart?: string} | undefined)?.howToStart !== 'apply',
      validation: (rule) =>
        rule.custom((value, context) => ((context.parent as {howToStart?: string})?.howToStart === 'apply' && !value ? 'Add the application link' : true)),
    }),
    defineField({name: 'languages', title: 'Languages offered', type: 'array', of: [defineArrayMember({type: 'string'})], options: {list: [{title: 'English', value: 'en'}, {title: 'Spanish', value: 'es'}, {title: 'Vietnamese', value: 'vi'}]}}),
    defineField({name: 'order', title: 'Order within its need', type: 'number'}),
  ],
  preview: {select: {title: 'internalName', subtitle: 'need'}},
})

/** A question and answer, shown on program pages and in the Hub. */
export const faq = defineType({
  name: 'faq',
  title: 'Question and answer',
  type: 'document',
  fields: [
    internalName,
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      options: {list: ['general', 'help', 'volunteer', 'give', 'program'].map((value) => ({title: value, value}))},
      validation: (rule) => rule.required(),
    }),
    localizedString({name: 'question', title: 'Question'}),
    localizedRichText({name: 'answer', title: 'Answer'}),
  ],
  preview: {select: {title: 'internalName', subtitle: 'topic'}},
})

/** About: Our Story (spec §10.5). Singleton. */
export const ourStory = defineType({
  name: 'ourStory',
  title: 'Our Story',
  type: 'document',
  fields: [
    localizedText({name: 'mission', title: 'Mission'}),
    localizedText({name: 'vision', title: 'Vision'}),
    localizedRichText({name: 'history', title: 'History'}),
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'founder',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            localizedString({name: 'title', title: 'Title', description: 'Per the glossary.'}),
            defineField({name: 'photo', title: 'Photo', type: 'accessibleImage'}),
            localizedText({name: 'bio', title: 'Short bio', required: false}),
          ],
          preview: {select: {title: 'name', media: 'photo'}},
        }),
      ],
    }),
    localizedRichText({name: 'howWeWork', title: 'How we work'}),
  ],
  preview: {prepare: () => ({title: 'Our Story'})},
})

/** Give → Planned (spec §9.7). Singleton. */
export const plannedGiving = defineType({
  name: 'plannedGiving',
  title: 'Planned giving',
  type: 'document',
  fields: [
    localizedText({name: 'intro', title: 'Introduction'}),
    defineField({
      name: 'ways',
      title: 'Ways to give',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'way',
          fields: [localizedString({name: 'title', title: 'Title'}), localizedText({name: 'body', title: 'Explanation'})],
          preview: {prepare: () => ({title: 'Way to give'})},
        }),
      ],
    }),
    defineField({name: 'legalName', title: 'Legal name for gifts in wills', type: 'string', validation: (rule) => rule.required()}),
    localizedText({name: 'note', title: 'Note under the inquiry form', required: false}),
  ],
  preview: {prepare: () => ({title: 'Planned giving'})},
})

/** Community Sponsor tiers (Give → Business). Singleton; tier names are a content task. */
export const sponsorTiers = defineType({
  name: 'sponsorTiers',
  title: 'Sponsor tiers',
  type: 'document',
  fields: [
    localizedText({name: 'intro', title: 'Introduction'}),
    defineField({
      name: 'tiers',
      title: 'Tiers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tier',
          fields: [
            defineField({name: 'key', title: 'Key', type: 'string', description: 'Stable id used by subscriptions. Never change it once live.', validation: (rule) => rule.required().regex(/^[a-z0-9-]+$/)}),
            localizedString({name: 'name', title: 'Name'}),
            defineField({name: 'monthlyAmount', title: 'Monthly amount (USD)', type: 'number', validation: (rule) => rule.required().positive().integer()}),
            defineField({name: 'benefits', title: 'Benefits', type: 'array', of: [defineArrayMember({type: 'internationalizedArrayString'})]}),
          ],
          preview: {select: {title: 'key', subtitle: 'monthlyAmount'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {prepare: () => ({title: 'Sponsor tiers'})},
})

/** Contact details, impact numbers, the meals-per-dollar ratio and the glossary. Singleton. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'contact', title: 'Contact', default: true},
    {name: 'impact', title: 'Impact'},
    {name: 'glossary', title: 'Glossary'},
  ],
  fields: [
    defineField({name: 'phone', title: 'Phone', type: 'string', group: 'contact', description: 'Format: (469) 969-0244', validation: (rule) => rule.required().regex(/^\(\d{3}\) \d{3}-\d{4}$/)}),
    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (rule) => rule.required().email()}),
    defineField({name: 'address', title: 'Address', type: 'text', rows: 2, group: 'contact'}),
    localizedText({name: 'hours', title: 'Office hours', group: 'contact', required: false}),
    defineField({
      name: 'impactStats',
      title: 'Impact numbers',
      description: 'Real values with the date they are true as of. No rounding up.',
      type: 'array',
      group: 'impact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({name: 'value', title: 'Value', type: 'number', validation: (rule) => rule.required().min(0)}),
            defineField({name: 'suffix', title: 'Suffix', type: 'string', description: 'Optional, e.g. "+"'}),
            localizedString({name: 'label', title: 'Label'}),
            defineField({name: 'asOf', title: 'As of', type: 'date', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'asOf'}},
        }),
      ],
      validation: (rule) => rule.max(5),
    }),
    defineField({name: 'mealsPerDollar', title: 'Meals per dollar', type: 'number', group: 'impact', description: 'Used in the Give impact line. Content task: confirm the ratio.'}),
    defineField({name: 'mealsPerDollarAsOf', title: 'Meals per dollar as of', type: 'date', group: 'impact'}),
    defineField({
      name: 'glossary',
      title: 'Glossary',
      type: 'array',
      group: 'glossary',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'term',
          fields: [
            defineField({name: 'thing', title: 'Thing', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'official', title: 'Official form', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'avoid', title: 'Do not use', type: 'array', of: [defineArrayMember({type: 'string'})]}),
          ],
          preview: {select: {title: 'thing', subtitle: 'official'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

export const editorialTypes = [program, service, faq, ourStory, plannedGiving, sponsorTiers, siteSettings]

/** Documents that exist exactly once, opened directly from the Studio menu. */
export const SINGLETONS = ['siteSettings', 'ourStory', 'plannedGiving', 'sponsorTiers'] as const
