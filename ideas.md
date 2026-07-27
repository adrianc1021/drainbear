# 通渠熊 DrainBear — 設計構思

## 參考基準（Ground Truth）
本專案以 Synthesia.io 風格截圖為版面與氣質參考：極簡 SaaS 風、大量留白、置中大標題、藍色漸層點綴、卡片網格、淺色背景與深色區塊交替。內容替換為用戶指定的通渠公司文案，並依用戶指定的配色系統覆蓋。

## 選定方向：Premium SaaS Minimalism（唯一方案，依用戶規範）
- **設計語言**：Apple / 高端 SaaS 極簡風，高對比、大留白、輕懸浮陰影卡片。
- **配色系統**：
  - 主色：海軍藍 `#0B132B`（深色區塊、標題文字）
  - 強調/CTA：WhatsApp 綠 `#25D366`（緊急報價按鈕、主要 CTA）
  - 次強調：安全橙 `#FF7A00`（小標籤、流程數字等點綴）
  - 背景：純白 `#FFFFFF` 與淺灰藍 `#F4F7FB`
- **圓角**：統一 8px（--radius: 0.5rem）。
- **圖標**：僅使用 lucide-react SVG 向量圖標，嚴禁 Emoji。
- **字體**：標題 Noto Sans TC 700/900 + 英文 display 用 Manrope/Space Grotesk；內文 Noto Sans TC 400/500。
- **版面**：
  - Header：Logo + 首頁/通渠服務/服務地區/常見問題 + 右側綠色「24hr 緊急報價」懸浮按鈕。
  - 首頁 Hero：左右佈局，左文右懸浮圖（floating image + 陰影 + 微動畫）。
  - 暗色優勢列：深海軍藍背景，橫向 4 欄。
  - 為什麼選擇我們：左 2x2 網格卡片、右大圖。
  - 服務頁：Z-Pattern 交替圖文 + 4 步橫向流程圖。
  - 服務地區：3 欄網格，地區為 pill 標籤。
  - FAQ：Accordion 折疊面板。
  - Footer：橫向 4 組數據（1000+ 案例 / 1 小時到達 / 98% 好評 / 24/7 熱線）。
- **互動**：所有按鈕 hover 平滑過渡（transform/color 180ms ease-out）、卡片 hover 抬升陰影、區塊入場 fade-up。
- **品牌**：Logo 為白熊頭 + 水滴/扳手極簡圖形符號，主色海軍藍配綠色點綴。

## 第二輪優化（參考 Wix 通渠熊網站）
參考網站重點：口語化廣東話標題（「塞渠爆喉？搵通渠熊，24小時一Call即到！」）、每張服務卡都有獨立 WhatsApp CTA、聯絡電話 +852 6531 8580、Footer 列出全部地區（SEO）、有「透明報價安心動工」信任區塊、服務細分（坐廁/企缸/廚房/隔氣/隔油池/沙井/CCTV）、地區頁有 SEO 導向的地區描述文案、有 Blog 最新消息。

### UX / 獲客優化
- Hero 標題改用更有力的口語化文案，強調「一Call即到」。
- 全站行動裝置底部固定 WhatsApp + 電話雙按鈕列（sticky mobile CTA bar）。
- 每張服務卡片附獨立「WhatsApp 查詢」CTA 並帶預填訊息（?text=）。
- 首頁新增「透明報價，安心動工」信任區塊 + 服務細分標籤（坐廁/企缸/廚房去水等）。
- 電話號碼統一 +852 6531 8580，支援 tel: 直撥。
- FAQ 頁 CTA、地區頁尾「統一透明收費」承諾區塊。

### SEO 完善
- 每頁獨立 title/meta description/canonical/OG 標籤（react-helmet 或自製 SEO component）。
- JSON-LD 結構化資料：LocalBusiness（Plumber）、FAQPage、Service、BreadcrumbList。
- Footer 全地區文字連結（內部連結 + 關鍵字覆蓋）。
- 語意化 HTML（h1 唯一、section/article、img alt 完整）。
- sitemap.xml + robots.txt。
- 地區頁加入 SEO 導向的分區描述文案。
