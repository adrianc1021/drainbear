import type {SchemaTypeDefinition} from 'sanity'
import {seoFields} from './seoFields'
import {pageSeo} from './pageSeo'

export const schemaTypes: SchemaTypeDefinition[] = [
  seoFields,
  pageSeo,
]
