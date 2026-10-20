import {defineField, defineType} from 'sanity'
import {eventDateFields, eventDetailFields} from './event-fields'

export const featuredEventType = defineType({
  name: 'featuredEvent',
  title: 'Featured Event',
  type: 'document',
  fields: [
    defineField({
      name: 'externalId',
      title: 'External ID',
      type: 'number',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    ...eventDateFields,
    ...eventDetailFields,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
  },
})
