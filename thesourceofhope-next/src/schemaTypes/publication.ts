import {defineField, defineType} from 'sanity'

export const publicationType = defineType({
	name: 'publication',
	title: 'Publication',
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
			name: 'date',
			title: 'Date',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'summary',
			title: 'Summary',
			type: 'text',
		}),
		defineField({
			name: 'url',
			title: 'URL',
			type: 'url',
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
			date: 'date',
		},
		prepare(selection) {
			const {title, date} = selection
			return {
				title: title,
				subtitle: date ? new Date(date).toLocaleDateString() : '',
			}
		},
	},
})
