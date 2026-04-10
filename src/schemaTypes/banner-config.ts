import {defineField, defineType} from 'sanity'

export const bannerConfigType = defineType({
	name: 'bannerConfig',
	title: 'Banner Config',
	type: 'document',
	fields: [
		defineField({
			name: 'enabled',
			title: 'Enabled',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'text',
			title: 'Text',
			type: 'string',
		}),
		defineField({
			name: 'link',
			title: 'Link',
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
			name: 'expires',
			title: 'Expires',
			type: 'datetime',
		}),
	],
	preview: {
		select: {
			title: 'text',
			enabled: 'enabled',
		},
		prepare(selection) {
			const {title, enabled} = selection
			return {
				title: title || 'Banner Config',
				subtitle: enabled ? 'Enabled' : 'Disabled',
			}
		},
	},
})
