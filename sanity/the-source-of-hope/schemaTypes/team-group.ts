import {defineField, defineType} from 'sanity'

export const teamGroupType = defineType({
  name: 'teamGroup',
  title: 'Team Group',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Lower numbers appear first on the Team page (1 = top). Groups left blank appear after numbered groups.',
      validation: (Rule) => Rule.integer().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      order: 'order',
    },
    prepare({title, order}) {
      return {
        title,
        subtitle: order ? `Order: ${order}` : 'No order set',
      }
    },
  },
})
