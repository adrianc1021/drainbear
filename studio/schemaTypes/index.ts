import type {SchemaTypeDefinition} from 'sanity'
import {seoFields} from './seoFields'
import {pageSeo} from './pageSeo'
import {blogPost} from './blogPost'
import {caseStudy} from './caseStudy'
import {siteSettings} from './siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  seoFields,
  pageSeo,
  blogPost,
  caseStudy,
  siteSettings,
]
