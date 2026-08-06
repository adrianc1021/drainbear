import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'drainbear-cms',
  title: 'DrainBear CMS',

  projectId: 'oyph9zy1',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (previousActions, context) => {
      if (context.schemaType !== 'siteSettings') {
        return previousActions
      }

      return previousActions.filter(
        (action) =>
          action.action !== 'delete' &&
          action.action !== 'duplicate',
      )
    },
  },
})
