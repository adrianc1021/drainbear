import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('DrainBear內容管理')
    .items([
      S.listItem()
        .id('siteSettings')
        .title('全站設定')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),

      S.divider(),

      S.documentTypeListItem('pageSeo')
        .id('pageSeo')
        .title('頁面 SEO'),

      S.documentTypeListItem('blogPost')
        .id('blogPost')
        .title('Blog文章'),

      S.documentTypeListItem('caseStudy')
        .id('caseStudy')
        .title('工程案例'),
    ])
