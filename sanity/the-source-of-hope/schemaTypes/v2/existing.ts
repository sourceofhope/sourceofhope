import {defineArrayMember, defineField, defineType} from 'sanity'
import {localizedRichText, localizedString, localizedText, slugField} from './shared'

/*
 * The types that already exist in `production`, in the v2 localized shape
 * (slice 2.5). Events are not here: they move to Postgres (02 §2, slice 2.6).
 * Recurring programs stay in Sanity as descriptive content.
 */

export const teamGroup = defineType({
  name: 'teamGroup',
  title: 'Team group',
  type: 'document',
  fields: [
    defineField({name: 'internalName', title: 'Internal name', type: 'string', validation: (rule) => rule.required()}),
    slugField(),
    localizedString({name: 'name', title: 'Name'}),
    localizedText({name: 'description', title: 'Description', required: false}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'internalName'}},
})

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
    slugField('name'),
    defineField({name: 'teamGroup', title: 'Team group', type: 'reference', to: [{type: 'teamGroup'}], validation: (rule) => rule.required()}),
    localizedString({name: 'title', title: 'Title', description: 'Per the glossary.'}),
    localizedText({name: 'shortBio', title: 'Short bio', required: false}),
    localizedRichText({name: 'bio', title: 'Bio', required: false}),
    defineField({name: 'image', title: 'Photo', type: 'accessibleImage'}),
    defineField({name: 'order', title: 'Order within the group', type: 'number'}),
  ],
  preview: {select: {title: 'name', media: 'image'}},
})

export const publication = defineType({
  name: 'publication',
  title: 'Story or update',
  type: 'document',
  fields: [
    localizedString({name: 'title', title: 'Title'}),
    defineField({name: 'date', title: 'Date', type: 'date', validation: (rule) => rule.required()}),
    localizedText({name: 'summary', title: 'Summary'}),
    defineField({name: 'url', title: 'Link', type: 'url', validation: (rule) => rule.required()}),
    defineField({name: 'image', title: 'Image', type: 'accessibleImage'}),
    defineField({name: 'legacyId', title: 'Legacy id', type: 'number', readOnly: true, hidden: true}),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'date', media: 'image'}},
})

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter issue',
  type: 'document',
  fields: [
    localizedString({name: 'title', title: 'Title'}),
    defineField({name: 'date', title: 'Date', type: 'date', validation: (rule) => rule.required()}),
    defineField({name: 'url', title: 'Link', type: 'url', validation: (rule) => rule.required()}),
    defineField({name: 'image', title: 'Cover image', type: 'accessibleImage'}),
    defineField({name: 'legacyId', title: 'Legacy id', type: 'number', readOnly: true, hidden: true}),
  ],
  preview: {select: {title: 'date', media: 'image'}},
})

export const product = defineType({
  name: 'product',
  title: 'Store product',
  type: 'document',
  fields: [
    defineField({name: 'internalName', title: 'Internal name', type: 'string', validation: (rule) => rule.required()}),
    slugField(),
    localizedString({name: 'title', title: 'Title'}),
    defineField({name: 'price', title: 'Price (USD)', type: 'number', validation: (rule) => rule.required().positive().precision(2)}),
    localizedText({name: 'shortDescription', title: 'Short description'}),
    localizedRichText({name: 'longDescription', title: 'Description', required: false}),
    localizedText({name: 'impact', title: 'Impact line', required: false}),
    defineField({name: 'sizes', title: 'Sizes', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'images', title: 'Images', type: 'array', of: [defineArrayMember({type: 'accessibleImage'})], validation: (rule) => rule.min(1)}),
    defineField({name: 'legacyId', title: 'Legacy id', type: 'number', readOnly: true, hidden: true}),
  ],
  preview: {select: {title: 'internalName', media: 'images.0'}},
})

export const recurringProgram = defineType({
  name: 'recurringProgram',
  title: 'Recurring program',
  description: 'Shown under "Every month" on the Events page.',
  type: 'document',
  fields: [
    defineField({name: 'internalName', title: 'Internal name', type: 'string', validation: (rule) => rule.required()}),
    localizedString({name: 'title', title: 'Title'}),
    localizedString({name: 'cadence', title: 'When', description: 'e.g. "Second Saturday of every month, 11 a.m."'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    localizedText({name: 'summary', title: 'Summary'}),
    defineField({name: 'image', title: 'Image', type: 'accessibleImage'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {select: {title: 'internalName', media: 'image'}},
})

export const checkoutProvider = defineType({
  name: 'checkoutProvider',
  title: 'Checkout provider',
  type: 'document',
  fields: [
    defineField({name: 'providerId', title: 'Provider', type: 'string', options: {list: ['stripe', 'paypal']}, validation: (rule) => rule.required()}),
    defineField({name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true}),
    localizedString({name: 'name', title: 'Name shown at checkout'}),
    localizedString({name: 'description', title: 'Description', required: false}),
  ],
  preview: {select: {title: 'providerId', subtitle: 'enabled'}},
})

export const existingTypes = [teamGroup, teamMember, publication, newsletter, product, recurringProgram, checkoutProvider]
