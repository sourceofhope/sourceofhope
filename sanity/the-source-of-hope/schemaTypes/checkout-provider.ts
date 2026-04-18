import {defineField, defineType} from 'sanity'

export const checkoutProviderType = defineType({
	name: 'checkoutProvider',
	title: 'Checkout Provider',
	type: 'document',
	fields: [
		defineField({
			name: 'providerId',
			title: 'Provider ID',
			type: 'string',
			validation: (Rule) => Rule.required().lowercase(),
		}),
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'string',
		}),
		defineField({
			name: 'enabled',
			title: 'Enabled',
			type: 'boolean',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'icon',
			title: 'Icon',
			type: 'string',
		}),
	],
	preview: {
		select: {
			title: 'name',
			enabled: 'enabled',
		},
		prepare(selection) {
			const {title, enabled} = selection
			return {
				title: title,
				subtitle: enabled ? 'Enabled' : 'Disabled',
			}
		},
	},
})
