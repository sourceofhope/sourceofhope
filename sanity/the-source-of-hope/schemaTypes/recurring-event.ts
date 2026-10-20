import {defineField, defineType} from 'sanity'
import {eventDateFields, eventDetailFields} from './event-fields'

export const recurringEventType = defineType({
  name: 'recurringEvent',
  title: 'Recurring Event',
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
    defineField({
      name: 'schedule',
      title: 'Schedule',
      description: 'How often it happens, e.g. "Second Saturday of every month, 10 AM to 1 PM".',
      type: 'string',
    }),
    ...eventDateFields,
    ...eventDetailFields,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'schedule',
    },
  },
})
