# 服務地區頁優化紀錄（2026-07-27）

## 已完成
- 新增 8 個地區著陸頁資料：`client/src/lib/districtData2.ts`
  - 旺角 mong-kok、深水埗 sham-shui-po、銅鑼灣 causeway-bay、北角 north-point、
    荃灣 tsuen-wan、元朗 yuen-long、屯門 tuen-mun、將軍澳 tseung-kwan-o
  - 合併於 districtData.ts 的 DISTRICTS（共 10 區，原有觀塘、沙田），並新增 DISTRICT_SLUGS 對照。
- Areas.tsx：
  - DISTRICT_PAGES 改為由 DISTRICT_SLUGS 自動生成
  - 三大分區清單擴充至共 78 區（港島 24、九龍 26、新界離島 28），STATS 更新為 78+
  - 精選卡改 sm:2 / lg:3 欄，SEO title/description/keywords 更新
- sitemap.xml：新增 8 個 /areas/{slug} URL（共 23 個 URL）

## 驗證（截圖確認）
- /areas 全頁正常：10 張精選卡三欄排列、三大分區 pill（有專頁的顯示綠色可點）
- /areas/mong-kok、/areas/tsuen-wan 著陸頁完整渲染（Hero/渠務特點/4 大求助/FAQ/CTA）
- TypeScript 0 errors；dotenv OK（舊 console 錯誤為歷史紀錄）

## 待辦
- [x] 手機視窗截圖驗證（375x812：/areas、/areas/causeway-bay 正常）
- [x] pnpm test 12 項通過

## 補充核實（scripts/verify-areas.mjs + grep）
- 搜尋：ALL_DISTRICTS 由 REGIONS flatMap 生成共 78 區，10 個著陸頁地區全部包含在內，可被搜尋且有 slug 者連至專頁。
- Areas JSON-LD：areaServed = ALL_DISTRICTS.map（78 區自動擴充）；SEO title/description/keywords 已更新；Breadcrumbs 沿用 AREAS_CRUMBS。
- District.tsx：jsonLd 含 Service（areaServed = 本區 + nearby）+ FAQPage，breadcrumbs 動態生成，getDistrict 由合併後 DISTRICTS 查找。
