import {defineField, defineType, type Rule} from 'sanity'

/*
 * Shared pieces for the v2 schema (slice 2.5).
 *
 * Every translatable field uses the field-level localized array shape from
 * sanity-plugin-internationalized-array (ADR-0004): English is the source
 * and is required; other languages are added later as translated copies.
 */

export const LANGUAGES = [{id: 'en', title: 'English'}]

export const PROGRAM_KEYS = [
  {title: 'Serving and Sharing Hope', value: 'servingHope'},
  {title: 'Education for Hope', value: 'educationHope'},
  {title: 'Wellness of Hope', value: 'wellnessHope'},
  {title: 'Hope for the Outdoors', value: 'outdoorHope'},
  {title: 'Hope Beyond Borders', value: 'internationalHope'},
]

/** Get Help needs (spec §9.5). "Something else" points to 211 and has no services. */
export const NEED_CATEGORIES = [
  {title: 'Food', value: 'food'},
  {title: 'Health care', value: 'health'},
  {title: 'Tutoring & school', value: 'school'},
  {title: 'Outdoor programs', value: 'outdoors'},
]

type LocalizedValue = {_key?: string; language?: string; value?: unknown}

/** True when the English value is present (the plugin stores the language in `language`, or in `_key` in older data). */
export function hasEnglish(value: unknown): boolean {
  if (!Array.isArray(value)) return false
  return (value as LocalizedValue[]).some((item) => {
    const lang = item.language ?? item._key
    const v = item.value
    if (lang !== 'en' || v == null) return false
    return typeof v === 'string' ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : true
  })
}

const englishRequired = (rule: Rule) => rule.custom((value) => (hasEnglish(value) ? true : 'English is required'))

type FieldOptions = {name: string; title: string; description?: string; required?: boolean; group?: string}

export const localizedString = ({required = true, ...field}: FieldOptions) =>
  defineField({...field, type: 'internationalizedArrayString', validation: required ? englishRequired : undefined})

export const localizedText = ({required = true, ...field}: FieldOptions) =>
  defineField({...field, type: 'internationalizedArrayText', validation: required ? englishRequired : undefined})

export const localizedRichText = ({required = true, ...field}: FieldOptions) =>
  defineField({...field, type: 'internationalizedArrayPortableText', validation: required ? englishRequired : undefined})

/**
 * Every image: alt text (or marked decorative) and a consent check (ADR-0007,
 * photo audit). An image of people can't be published until someone confirms
 * the people in it agreed to be shown.
 */
export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'decorative',
      title: 'Decorative only',
      description: 'Tick only if the image adds nothing a screen-reader user would miss.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      description: 'What the image shows, in one sentence. Leave out "image of".',
      type: 'internationalizedArrayString',
      hidden: ({parent}) => Boolean((parent as {decorative?: boolean} | undefined)?.decorative),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {decorative?: boolean; asset?: unknown} | undefined
          if (!parent?.asset || parent.decorative) return true
          return hasEnglish(value) ? true : 'Add alt text, or mark the image decorative'
        }),
    }),
    defineField({
      name: 'consentCleared',
      title: 'Consent confirmed',
      description: 'Everyone recognizable in this photo agreed to it being used, or no one is recognizable.',
      type: 'boolean',
      initialValue: false,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {asset?: unknown} | undefined
          return !parent?.asset || value === true ? true : 'Confirm consent before publishing this image'
        }),
    }),
    defineField({name: 'credit', title: 'Photo credit', type: 'string'}),
  ],
})

/** An external link with a localized label ("Apply online"). */
export const externalLink = defineType({
  name: 'externalLink',
  title: 'External link',
  type: 'object',
  fields: [
    localizedString({name: 'label', title: 'Label'}),
    defineField({name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required().uri({scheme: ['https', 'mailto', 'tel']})}),
  ],
  preview: {select: {title: 'url'}},
})

export const slugField = (source = 'internalName') =>
  defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source}, validation: (rule) => rule.required()})

/** A plain English name for lists in the Studio (not shown on the site). */
export const internalName = defineField({
  name: 'internalName',
  title: 'Internal name',
  description: 'Shown only in the Studio, to find this document.',
  type: 'string',
  validation: (rule) => rule.required(),
})

export const sharedTypes = [accessibleImage, externalLink]
