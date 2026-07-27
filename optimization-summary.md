# 第二輪優化摘要（UX / 獲客 / SEO）

已完成項目：
1. 聯絡資訊統一：`client/src/lib/contact.ts`（電話 +852 6531 8580、waLink() 預填訊息）。
2. SEO 元件：`client/src/components/SEO.tsx`（每頁 title/description/canonical/OG + JSON-LD：Plumber LocalBusiness 全站、FAQPage、Service、BreadcrumbList、WebSite）。
3. Layout：行動裝置底部固定 WhatsApp+電話雙 CTA 列（MobileCTABar）、Footer 加三欄地區 SEO 連結區與電話熱線。
4. 首頁：Hero 改口語化「塞渠爆喉？一 Call 即到。」、雙 CTA（WhatsApp 綠 + 電話 navy）、新增「透明報價安心動工」三卡信任區塊、新增四大服務卡（每卡獨立 WhatsApp 預填訊息 CTA + 圖片）。
5. 服務頁：H1 改「全方位通渠服務…」、Z-pattern 各服務獨立 wa 訊息、新增「服務範疇一覽」細分（坐廁/鋅盤/企缸/隔氣/隔油池/高壓洗渠車/沙井主渠/CCTV 報告）、4 步流程描述加詳。
6. 地區頁：每區加 SEO 長文案、Pill 標籤改「XX通渠」、新增「超越地區界限統一透明收費」navy 承諾區塊。
7. FAQ 頁：FAQPage JSON-LD。
8. index.html：完善 meta（keywords/robots/theme-color/geo/og:image）；新增 `client/public/robots.txt` 及 `sitemap.xml`（域名暫用 https://drainbear.manus.space）。

截圖驗證：四頁均正常渲染，TypeScript 無錯誤。

注意：正式發佈後如域名不同，需更新 SEO.tsx 的 SITE_URL、sitemap.xml、robots.txt 中的域名。
