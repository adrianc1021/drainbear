import {defineField, defineType} from 'sanity'

export const pageSeo = defineType({
  name: 'pageSeo',
  title: '頁面 SEO',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: '頁面名稱',
      description: '只供後台辨認，例如「首頁」或「服務頁」。',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),

    defineField({
      name: 'path',
      title: '頁面路徑',
      description: '例如 /、/services、/guide。必須以 / 開頭。',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value) return true
            if (!value.startsWith('/')) return '頁面路徑必須以 / 開頭。'
            if (value.includes('?') || value.includes('#')) {
              return '頁面路徑不應包含查詢參數或 #。'
            }
            if (value.length > 1 && value.endsWith('/')) {
              return '除首頁外，頁面路徑結尾不應包含 /。'
            }
            return true
          }),
    }),

    defineField({
      name: 'seo',
      title: 'SEO 設定',
      type: 'seoFields',
      validation: (rule) => rule.required(),
    }),
  ],

  orderings: [
    {
      title: '頁面路徑',
      name: 'pathAsc',
      by: [{field: 'path', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'path',
    },
  },
})
