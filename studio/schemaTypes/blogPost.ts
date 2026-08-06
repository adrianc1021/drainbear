import {defineArrayMember, defineField, defineType} from 'sanity'

const CATEGORY_OPTIONS = [
  {title: '家居防塞', value: 'home-prevention'},
  {title: '緊急應對', value: 'emergency'},
  {title: '通渠迷思', value: 'myths'},
  {title: '商業渠務', value: 'commercial'},
  {title: '村屋渠務', value: 'village-house'},
  {title: '大廈渠務', value: 'building'},
  {title: '渠務科技', value: 'technology'},
]

const CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_OPTIONS.map((category) => [category.value, category.title]),
)

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog 文章',
  type: 'document',

  groups: [
    {
      name: 'content',
      title: '文章內容',
      default: true,
    },
    {
      name: 'distribution',
      title: '發布設定',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: '文章標題',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),

    defineField({
      name: 'slug',
      title: '網址 Slug',
      description: '按 Generate由文章標題自動產生；發布後不應隨意更改。',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'category',
      title: '文章分類',
      type: 'string',
      group: 'content',
      options: {
        list: CATEGORY_OPTIONS,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: '文章摘要',
      description: '用於Blog列表及文章簡介，建議50–200個字元。',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (rule) => [
        rule.required(),
        rule
          .min(50)
          .warning('摘要少於50個字元，可能未能充分說明文章內容。'),
        rule.max(200),
      ],
    }),

    defineField({
      name: 'coverImage',
      title: '封面圖片',
      description: '建議使用橫向圖片，並填寫準確替代文字。',
      type: 'image',
      group: 'content',
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
        defineField({
          name: 'caption',
          title: '圖片說明',
          type: 'string',
          validation: (rule) => rule.max(200),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'body',
      title: '文章正文',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: '正文', value: 'normal'},
            {title: '大標題 H2', value: 'h2'},
            {title: '小標題 H3', value: 'h3'},
            {title: '引用', value: 'blockquote'},
          ],
          lists: [
            {title: '項目符號', value: 'bullet'},
            {title: '數字列表', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: '粗體', value: 'strong'},
              {title: '斜體', value: 'em'},
              {title: '底線', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                title: '連結',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: '網址',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: '在新分頁開啟',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),

        defineArrayMember({
          name: 'articleImage',
          title: '文章圖片',
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
            defineField({
              name: 'caption',
              title: '圖片說明',
              type: 'string',
              validation: (rule) => rule.max(200),
            }),
          ],
        }),

        defineArrayMember({
          name: 'expertTip',
          title: '白熊師傅貼士',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: '貼士標題',
              type: 'string',
              initialValue: '白熊師傅貼士',
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: 'text',
              title: '貼士內容',
              type: 'text',
              rows: 5,
              validation: (rule) => rule.required().max(600),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'text',
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'publishedAt',
      title: '發布日期',
      type: 'datetime',
      group: 'distribution',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'updatedAt',
      title: '內容更新日期',
      description: '文章有重大內容更新時填寫；一般小修改可以留空。',
      type: 'datetime',
      group: 'distribution',
    }),

    defineField({
      name: 'readMins',
      title: '預計閱讀時間（分鐘）',
      type: 'number',
      group: 'distribution',
      initialValue: 4,
      validation: (rule) =>
        rule.required().integer().min(1).max(30),
    }),

    defineField({
      name: 'featured',
      title: '首頁精選文章',
      description: '啟用後可在首頁Blog區域優先顯示。',
      type: 'boolean',
      group: 'distribution',
      initialValue: false,
    }),

    defineField({
      name: 'instagramUrl',
      title: '相關 Instagram貼文',
      description: '選填；必須使用instagram.com連結。',
      type: 'url',
      group: 'distribution',
      validation: (rule) =>
        rule
          .uri({
            scheme: ['https'],
          })
          .custom((value) => {
            if (!value) return true

            try {
              const url = new URL(value)
              const hostname = url.hostname.toLowerCase()

              if (
                hostname !== 'instagram.com' &&
                hostname !== 'www.instagram.com'
              ) {
                return '請輸入有效的 Instagram連結。'
              }

              return true
            } catch {
              return 'Instagram連結格式不正確。'
            }
          }),
    }),

    defineField({
      name: 'seo',
      title: 'SEO 設定',
      type: 'seoFields',
      group: 'seo',
      validation: (rule) => rule.required(),
    }),
  ],

  orderings: [
    {
      title: '發布日期（最新優先）',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: '標題',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      category: 'category',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, category, publishedAt}) {
      const categoryLabel =
        CATEGORY_LABELS[category as string] ?? '未分類'

      const dateLabel = publishedAt
        ? new Date(publishedAt as string).toLocaleDateString('zh-HK')
        : '未設定日期'

      return {
        title: title || '未命名文章',
        media,
        subtitle: `${categoryLabel}・${dateLabel}`,
      }
    },
  },
})
