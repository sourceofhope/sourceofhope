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
			name: 'categories',
			title: 'Categories',
			type: 'array',
			of: [{type: 'reference', to: [{type: 'productCategory'}]}],
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
			name: 'featuredMedia',
			title: 'Featured Media',
			type: 'object',
			fields: [
				defineField({
					name: 'sourceUrl',
					title: 'Source URL',
					type: 'url',
				}),
				defineField({
					name: 'altText',
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
