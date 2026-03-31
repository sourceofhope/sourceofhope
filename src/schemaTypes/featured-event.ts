import {defineField, defineType} from 'sanity'

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
		defineField({
			name: 'date',
			title: 'Date',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'location',
			title: 'Location',
			type: 'string',
		}),
		defineField({
			name: 'summary',
			title: 'Summary',
			type: 'text',
		}),
		defineField({
			name: 'eventPage',
			title: 'Event Page',
			type: 'object',
			fields: [
				defineField({
					name: 'url',
					title: 'URL',
					type: 'url',
				}),
			],
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
			subtitle: 'date',
		},
	},
})
