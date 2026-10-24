import type { BlogPostView } from "./blogRepository";
import { ARTICLE_IMAGES } from "./articleImages";
export const BASIN_SLUG = "slow-basin-drain-causes-solutions";
export const BASIN_MESSAGE =
  "你好，我想查詢洗手盆塞／洗手盆去水慢報價。地區：＿＿；情況（去水慢／完全塞／漏水）：＿＿；有否用過通渠水：＿＿。我會傳盆口及櫃底相片，請告知初步報價、包括的工序及可上門時間。";
/** Short service-oriented website revision; original CMS data remains intact. */
export function applyBasinConversion(post: BlogPostView): BlogPostView {
  if (post.slug !== BASIN_SLUG) return post;
  return {
    ...post,
    source: "static",
    body: undefined,
    readMins: 2,
    inquiryScenario: undefined,
    whatsappMessage: BASIN_MESSAGE,
    sections: [
      { type: "h2", text: "通渠熊可以點幫你？" },
      {
        type: "p",
        text: "檢查洗手盆去水口、隔氣及相連支渠，按堵塞位置安排清理或疏通。先說明方法與收費，確認後才動工，完成後按工作範圍試水。",
        link: {
          label: "了解洗手盆及浴室通渠服務",
          href: "/services/bathroom-drain-unblocking",
        },
      },
      {
        type: "image",
        image: {
          ...ARTICLE_IMAGES.sink,
          caption: undefined,
          presentation: "compact",
        },
      },
      { type: "h2", text: "想格價？先問清楚三件事" },
      {
        type: "image",
        image: {
          ...ARTICLE_IMAGES.quote,
          caption: undefined,
          presentation: "compact",
        },
      },
      {
        type: "list",
        items: [
          "報價包括檢查、疏通及試水哪些工序？",
          "需要拆隔氣或其他喉件時，費用怎樣計？",
          "可以安排甚麼上門時段？",
        ],
      },
      {
        type: "p",
        text: "傳盆口、櫃底相片及所在地區，方便先了解堵塞情況與報價範圍。實際費用按入口、工具及拆裝需要確認。",
      },
      { type: "h2", text: "睇洗手盆施工紀錄" },
      {
        type: "image",
        image: {
          ...ARTICLE_IMAGES.waterTest,
          caption: undefined,
          presentation: "compact",
        },
      },
      {
        type: "p",
        text: "想了解實際做法，可查看油垢清理及試水過程。",
        link: {
          label: "洗手盆清理案例",
          href: "/cases/home-basin-grease-buildup-cleaning",
        },
      },
    ],
    resourceLinks: [],
    relatedSlugs: [
      "bathroom-hair-clog-prevention",
      "toilet-clog-emergency-guide",
    ],
  };
}
