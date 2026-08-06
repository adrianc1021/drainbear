import {defineArrayMember, defineField, defineType} from 'sanity'

const SERVICE_TYPE_OPTIONS = [
  {title: '住宅通渠', value: 'residential'},
  {title: '商業通渠', value: 'commercial'},
  {title: '高壓水槍洗渠', value: 'hydrojet'},
  {title: 'CCTV 照喉', value: 'cctv'},
  {title: '隔油池清理', value: 'grease-trap'},
  {title: '沙井／村屋渠務', value: 'manhole'},
  {title: '大廈主渠工程', value: 'building-main'},
  {title: '其他渠務工程', value: 'other'},
]

const SERVICE_TYPE_LABELS = Object.fromEntries(
  SERVICE_TYPE_OPTIONS.map((service) => [service.value, service.title]),
)

const caseImageMember = defineArrayMember({
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
})

export const caseStudy = defineType({
  name: 'caseStudy',
  title: '工程案例',
  type: 'document',

  groups: [
    {
      name: 'content',
      title: '案例內容',
      default: true,
    },
    {
      name: 'media',
      title: '工程圖片',
    },
    {
      name: 'distribution',
      title: '顯示及 Instagram',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: '案例標題',
      description: '例如「觀塘工廈食堂去水位嚴重淤塞」。',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(100),
    }),

    defineField({
      name: 'slug',
      title: '網址 Slug',
      description: '按 Generate自動產生；發布後不應隨意更改。',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'district',
      title: '地區',
      description: '只填地區，不應填寫客戶完整地址。',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(50),
    }),

    defineField({
      name: 'serviceType',
      title: '工程類型',
      type: 'string',
      group: 'content',
      options: {
        list: SERVICE_TYPE_OPTIONS,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'projectDate',
      title: '工程日期',
      type: 'date',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value) return true

            const today = new Date().toISOString().slice(0, 10)

            if (value > today) {
              return '已完成案例的工程日期不應是未來日期。'
            }

            return true
          }),
    }),

    defineField({
      name: 'summary',
      title: '案例摘要',
      description: '用於首頁及案例列表，建議60–240個字元。',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (rule) => [
        rule.required(),
        rule
          .min(60)
          .warning('摘要少於60個字元，可能未能充分說明工程內容。'),
        rule.max(240),
      ],
    }),

    defineField({
      name: 'problem',
      title: '現場問題',
      type: 'text',
      rows: 5,
      group: 'content',
      validation: (rule) => rule.required().max(1000),
    }),

    defineField({
      name: 'workPerformed',
      title: '施工內容',
      description: '說明使用咗咩方法、設備及處理步驟。',
      type: 'text',
      rows: 7,
      group: 'content',
      validation: (rule) => rule.required().max(2000),
    }),

    defineField({
      name: 'result',
      title: '完成結果',
      description: '例如放水測試、CCTV覆檢或喉管恢復情況。',
      type: 'text',
      rows: 5,
      group: 'content',
      validation: (rule) => rule.required().max(1000),
    }),

    defineField({
      name: 'arrivalMinutes',
      title: '到達時間（分鐘）',
      description: '由接報至到場的實際分鐘數；不適用可留空。',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.integer().min(1).max(1440),
    }),

    defineField({
      name: 'durationMinutes',
      title: '施工時間（分鐘）',
      description: '實際工程所需時間；不適用可留空。',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.integer().min(1).max(10080),
    }),

    defineField({
      name: 'equipmentUsed',
      title: '使用設備',
      description: '例如高壓水槍、CCTV照喉設備、大型吸車。',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'string',
          validation: (rule) => rule.max(80),
        },
      ],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.unique().max(10),
    }),

    defineField({
      name: 'coverImage',
      title: '案例封面圖片',
      description: '發布案例前必須加入真實工程圖片。',
      type: 'image',
      group: 'media',
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
      name: 'beforeImages',
      title: '施工前圖片',
      type: 'array',
      group: 'media',
      of: [caseImageMember],
      validation: (rule) => rule.max(10),
    }),

    defineField({
      name: 'afterImages',
      title: '施工後圖片',
      type: 'array',
      group: 'media',
      of: [caseImageMember],
      validation: (rule) => rule.max(10),
    }),

    defineField({
      name: 'featured',
      title: '首頁精選案例',
      description: '啟用後可以顯示於首頁工程案例區域。',
      type: 'boolean',
      group: 'distribution',
      initialValue: false,
    }),

    defineField({
      name: 'homepageOrder',
      title: '首頁顯示次序',
      description: '數字越小越前；只在首頁精選啟用時使用。',
      type: 'number',
      group: 'distribution',
      hidden: ({parent}) => !parent?.featured,
      validation: (rule) => rule.integer().min(1).max(20),
    }),

    defineField({
      name: 'instagramUrl',
      title: 'Instagram貼文連結',
      description: '選填；案例發布到Instagram後貼上相關連結。',
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
                return '請輸入有效的Instagram連結。'
              }

              return true
            } catch {
              return 'Instagram連結格式不正確。'
            }
          }),
    }),

    defineField({
      name: 'instagramMediaId',
      title: 'Instagram Media ID',
      description: '預留給日後Meta API整合；目前可以留空。',
      type: 'string',
      group: 'distribution',
      validation: (rule) => rule.max(100),
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
      title: '工程日期（最新優先）',
      name: 'projectDateDesc',
      by: [{field: 'projectDate', direction: 'desc'}],
    },
    {
      title: '首頁顯示次序',
      name: 'homepageOrderAsc',
      by: [{field: 'homepageOrder', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      district: 'district',
      serviceType: 'serviceType',
      projectDate: 'projectDate',
    },
    prepare({title, media, district, serviceType, projectDate}) {
      const serviceLabel =
        SERVICE_TYPE_LABELS[serviceType as string] ?? '未分類'

      return {
        title: title || '未命名案例',
        media,
        subtitle: [
          district || '未設定地區',
          serviceLabel,
          projectDate || '未設定日期',
        ].join('・'),
      }
    },
  },
})
