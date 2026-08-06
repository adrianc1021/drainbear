import type {SchemaTypeDefinition} from 'sanity'
import {seoFields} from './seoFields'
import {pageSeo} from './pageSeo'
import {blogPost} from './blogPost'

export const schemaTypes: SchemaTypeDefinition[] = [
  seoFields,
  pageSeo,
  blogPost,
]
