import {defineField, defineType} from 'sanity'

export const newsletterType = defineType({
	name: 'newsletter',
	title: 'Newsletter',
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
			name: 'url',
			title: 'Newsletter URL',
			type: 'url',
			validation: (Rule) => Rule.required(),
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
		},
	},
})
