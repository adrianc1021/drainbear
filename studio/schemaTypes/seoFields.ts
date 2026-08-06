import {defineField, defineType} from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO 設定',
  type: 'object',

  fields: [
    defineField({
      name: 'metaTitle',
      title: 'SEO 標題',
      description: '建議不超過 60 個字元，搜尋結果可能會截斷過長標題。',
      type: 'string',
      validation: (rule) => [
        rule.required(),
        rule.max(60).warning('建議將 SEO 標題控制在 60 個字元內。'),
      ],
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta 描述',
      description: '建議使用 50–160 個字元，清楚說明頁面內容及服務重點。',
      type: 'text',
      rows: 4,
      validation: (rule) => [
        rule.required(),
        rule
          .min(50)
          .warning('Meta 描述少於 50 個字元，可能未能充分說明頁面內容。'),
        rule
          .max(160)
          .warning('Meta 描述超過 160 個字元，搜尋結果可能會截斷。'),
      ],
    }),

    defineField({
      name: 'focusKeywords',
      title: '重點關鍵字',
      description: '供編輯規劃使用；Google不會因 meta keywords直接提升排名。',
      type: 'array',
      of: [
        {
          type: 'string',
          validation: (rule) => rule.max(60),
        },
      ],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.unique().max(10),
    }),

    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      description: '通常留空並由網站按頁面路徑自動產生；只有需要覆蓋時才填寫。',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
        }),
    }),

    defineField({
      name: 'ogTitle',
      title: '社交分享標題',
      description: '留空時使用 SEO標題。',
      type: 'string',
      validation: (rule) => rule.max(70),
    }),

    defineField({
      name: 'ogDescription',
      title: '社交分享描述',
      description: '留空時使用 Meta描述。',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(200),
    }),

    defineField({
      name: 'ogImage',
      title: '社交分享圖片',
      description: '建議比例 1.91:1，例如 1200 × 630 px。',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: '圖片替代文字',
          type: 'string',
          validation: (rule) => rule.required().max(150),
        }),
      ],
    }),

    defineField({
      name: 'noIndex',
      title: '禁止搜尋引擎索引',
      description: '只應用於不想出現在搜尋結果的頁面。',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
