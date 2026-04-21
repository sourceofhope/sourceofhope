import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
    }),
    defineField({
      name: 'impact',
      title: 'Impact',
      type: 'text',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Product',
        subtitle: typeof subtitle === 'number' ? `$${subtitle}` : undefined,
      }
    },
  },
})
