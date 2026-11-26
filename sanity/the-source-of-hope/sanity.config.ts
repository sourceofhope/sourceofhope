import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {defineField} from 'sanity'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {LANGUAGES, SINGLETONS, schemaTypesV2} from './schemaTypes/v2'
import {structureV2} from './structure'

const projectId = 'sgzdqn9z'

/*
 * Two workspaces (ADR-0004, ADR-0007):
 *  - "production": today's site and schema, unchanged, so the current site
 *    keeps working until cutover.
 *  - "v2": the relaunch schema (structured, localized) on `staging` by
 *    default, or `production-v2` with SANITY_STUDIO_V2_DATASET.
 */
export default defineConfig([
  {
    name: 'default',
    title: 'The Source of Hope',
    basePath: '/production',
    projectId,
    dataset: 'production',
    plugins: [structureTool(), visionTool()],
    schema: {types: schemaTypes},
  },
  {
    name: 'v2',
    title: 'The Source of Hope (v2)',
    basePath: '/v2',
    projectId,
    dataset: process.env.SANITY_STUDIO_V2_DATASET || 'staging',
    plugins: [
      structureTool({structure: structureV2}),
      visionTool(),
      internationalizedArray({
        languages: LANGUAGES,
        defaultLanguages: ['en'],
        fieldTypes: ['string', 'text', defineField({name: 'portableText', type: 'array', of: [{type: 'block'}]})],
      }),
    ],
    schema: {
      types: schemaTypesV2,
      // Singletons can't be created again or duplicated from the menu.
      templates: (templates) => templates.filter(({schemaType}) => !(SINGLETONS as readonly string[]).includes(schemaType)),
    },
    document: {
      actions: (actions, {schemaType}) =>
        (SINGLETONS as readonly string[]).includes(schemaType) ? actions.filter(({action}) => !['duplicate', 'delete', 'unpublish'].includes(action ?? '')) : actions,
    },
  },
])
