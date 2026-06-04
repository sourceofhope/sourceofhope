import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'The source of hope',

  projectId: 'sgzdqn9z',
  dataset: 'production',
  dataset: 'development'

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
