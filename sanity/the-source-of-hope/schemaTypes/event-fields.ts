import {defineField} from 'sanity'

/**
 * Fields shared by Featured Events and Recurring Events. The website reads
 * them in /src/lib/sanity-content.ts (EVENT_FIELDS), so keep names in sync.
 */

const centralTime = {
  displayTimeZone: 'America/Chicago',
  allowTimeZoneSwitch: false,
}

export const eventDateFields = [
  defineField({
    name: 'date',
    title: 'Start Date and Time',
    description: 'Central time. For recurring events, use the next occurrence.',
    type: 'datetime',
    options: centralTime,
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'endDate',
    title: 'End Date and Time',
    description: 'Optional. Shown as a time range in the event details.',
    type: 'datetime',
    options: centralTime,
    validation: (Rule) =>
      Rule.custom((endDate, context) => {
        const start = (context.document as {date?: string} | undefined)?.date
        if (!endDate || !start) return true
        return new Date(endDate as string) > new Date(start) || 'End must be after the start'
      }),
  }),
]

export const eventDetailFields = [
  defineField({
    name: 'location',
    title: 'Location Name',
    description: 'Short place name shown on cards, e.g. "Cornerstone Kitchen".',
    type: 'string',
  }),
  defineField({
    name: 'address',
    title: 'Street Address',
    description: 'Optional. Used to link to Google Maps in the event details.',
    type: 'string',
  }),
  defineField({
    name: 'summary',
    title: 'Summary',
    description: 'One or two sentences shown on the event card.',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'description',
    title: 'Full Description',
    description:
      'Shown in the event details window: what volunteers will do, who it serves, what to bring. Line breaks are kept.',
    type: 'text',
    rows: 8,
  }),
  defineField({
    name: 'program',
    title: 'Program',
    description: 'Optional. Shown as a tag on the event.',
    type: 'string',
    options: {
      list: [
        {title: 'Serving & Sharing Hope', value: 'servingHope'},
        {title: 'Education for Hope', value: 'educationHope'},
        {title: 'Wellness of Hope', value: 'wellnessHope'},
        {title: 'Hope for the Outdoors', value: 'outdoorHope'},
        {title: 'Hope Beyond Borders', value: 'internationalHope'},
      ],
    },
  }),
  defineField({
    name: 'waiver',
    title: 'Volunteer Waiver',
    description:
      'Which waiver volunteers are asked to sign before registering. Choose "None" for events without volunteers, such as galas.',
    type: 'string',
    initialValue: 'general',
    options: {
      layout: 'radio',
      list: [
        {title: 'General Volunteer Agreement', value: 'general'},
        {title: 'Serving Hope Volunteer Agreement (Cornerstone Kitchen)', value: 'serving-hope'},
        {title: 'None', value: 'none'},
      ],
    },
  }),
  defineField({
    name: 'eventPage',
    title: 'Registration Page',
    type: 'object',
    fields: [
      defineField({
        name: 'url',
        title: 'URL',
        description: 'Eventbrite (or other) registration link.',
        type: 'url',
      }),
    ],
  }),
  defineField({
    name: 'image',
    title: 'Image',
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
      }),
    ],
  }),
]
