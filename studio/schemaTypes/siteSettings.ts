import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '全站設定',
  type: 'document',

  groups: [
    {
      name: 'business',
      title: '公司資料',
      default: true,
    },
    {
      name: 'contact',
      title: '聯絡方式',
    },
    {
      name: 'social',
      title: '社交平台',
    },
    {
      name: 'display',
      title: '顯示設定',
    },
    {
      name: 'seo',
      title: '預設 SEO',
    },
  ],

  fields: [
    defineField({
      name: 'businessName',
      title: '公司名稱',
      type: 'string',
      group: 'business',
      initialValue: '通渠熊 DrainBear',
      validation: (rule) => rule.required().max(100),
    }),

    defineField({
      name: 'siteUrl',
      title: '正式網站網址',
      type: 'url',
      group: 'business',
      initialValue: 'https://drainbearhk.com',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['https'],
        }),
    }),

    defineField({
      name: 'businessDescription',
      title: '公司簡介',
      description: '用於搜尋引擎、社交分享及結構化資料。',
      type: 'text',
      rows: 5,
      group: 'business',
      validation: (rule) => rule.required().min(50).max(500),
    }),

    defineField({
      name: 'phoneDisplay',
      title: '電話顯示格式',
      description: '例如 +852 9558 8260。',
      type: 'string',
      group: 'contact',
      initialValue: '+852 9558 8260',
      validation: (rule) => rule.required().max(30),
    }),

    defineField({
      name: 'phoneE164',
      title: '電話 E.164格式',
      description: '只供網站電話連結及結構化資料使用，例如 +85295588260。',
      type: 'string',
      group: 'contact',
      initialValue: '+85295588260',
      validation: (rule) =>
        rule
          .required()
          .regex(
            /^\+852\d{8}$/,
            '請使用 +852 加8位香港電話號碼，例如 +85295588260。',
          ),
    }),

    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp號碼',
      description: '不使用空格或加號，例如 85295588260。',
      type: 'string',
      group: 'contact',
      initialValue: '85295588260',
      validation: (rule) =>
        rule
          .required()
          .regex(
            /^852\d{8}$/,
            '請使用 852 加8位香港電話號碼，例如 85295588260。',
          ),
    }),

    defineField({
      name: 'whatsappDefaultMessage',
      title: 'WhatsApp預設訊息',
      type: 'text',
      rows: 3,
      group: 'contact',
      initialValue: '你好，我想查詢通渠服務報價。',
      validation: (rule) => rule.required().max(300),
    }),

    defineField({
      name: 'instagramUrl',
      title: 'Instagram專頁網址',
      type: 'url',
      group: 'social',
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
                return '請輸入有效的Instagram網址。'
              }

              return true
            } catch {
              return 'Instagram網址格式不正確。'
            }
          }),
    }),

    defineField({
      name: 'googleBusinessUrl',
      title: 'Google商家／評價網址',
      type: 'url',
      group: 'social',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
        }),
    }),

    defineField({
      name: 'featuredBlogCount',
      title: '首頁精選文章數量',
      type: 'number',
      group: 'display',
      initialValue: 3,
      validation: (rule) => rule.required().integer().min(1).max(6),
    }),

    defineField({
      name: 'featuredCaseCount',
      title: '首頁精選案例數量',
      type: 'number',
      group: 'display',
      initialValue: 3,
      validation: (rule) => rule.required().integer().min(1).max(6),
    }),

    defineField({
      name: 'defaultOgImage',
      title: '預設社交分享圖片',
      description: '建議1200 × 630 px；頁面冇獨立圖片時使用。',
      type: 'image',
      group: 'seo',
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
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'defaultSeo',
      title: '全站預設 SEO',
      description: '頁面未有獨立SEO設定時使用。',
      type: 'seoFields',
      group: 'seo',
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'businessName',
      media: 'defaultOgImage',
    },
    prepare({title, media}) {
      return {
        title: title || '全站設定',
        subtitle: '網站聯絡方式、社交平台及預設SEO',
        media,
      }
    },
  },
})
