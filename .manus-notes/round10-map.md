# 第十輪：互動地圖 + 分區清單重設計 進度筆記

## 地圖資料來源（已確定）
- 採用 Paulkit/HKMap 各區 GeoJSON：https://github.com/Paulkit/HKMap（MIT-ish, LICENSE 存在）
  - 已下載 18 個檔到 /home/ubuntu/webdev-static-assets/hkmap_json/*.json
  - 每檔 FeatureCollection，1 feature，Polygon/MultiPolygon/GeometryCollection
- 備用來源 kenchu gist hk18.geojson（/home/ubuntu/webdev-static-assets/hk18.geojson）
  含海域邊界（區界延伸到海中，視覺不佳），棄用
- Wikimedia SVG（hk18_blank.svg / hk18_zh.svg）無具名區 ID，棄用

## 轉換腳本
- /home/ubuntu/webdev-static-assets/geojson_to_svg2.py：GeoJSON → 簡化 SVG path，
  輸出 TS 模組 /home/ubuntu/webdev-static-assets/hkDistrictPaths.ts
  （完成後複製到 client/src/lib/hkDistrictPaths.ts）
- RDP 簡化 eps=0.7px，viewBox 1000 寬，過濾面積 <6px² 小島
- 預覽腳本 preview_map.py → hk_preview.svg/png（需相應更新 regex）

## 十八區 → 專頁 slug 對照（region: hki/kln/nt）
- 中西區 hki → null；灣仔區 hki → causeway-bay；東區 hki → north-point；南區 hki → null
- 油尖旺區 kln → mong-kok；深水埗區 kln → sham-shui-po；九龍城區 kln → null；
  黃大仙區 kln → null；觀塘區 kln → kwun-tong
- 荃灣區 nt → tsuen-wan；屯門區 nt → tuen-mun；元朗區 nt → yuen-long；北區 nt → null；
  大埔區 nt → tai-po(無專頁 null)；西貢區 nt → tseung-kwan-o；沙田區 nt → sha-tin；
  葵青區 nt → null；離島區 nt → null

## 待辦
1. [x] 執行 geojson_to_svg2.py、預覽驗證形狀 OK（hkDistrictPaths.ts 已複製到 client/src/lib/，MAP_VIEWBOX='0 0 1000 729'，MapDistrict: id/name/nameEn/region/slug/cx/cy/d）
2. [x] HongKongMap.tsx 已建立（hover tooltip、點擊資訊卡含專頁入口/WhatsApp CTA、圖例、鍵盤 a11y）
3. [x] Areas.tsx 已整合：互動地圖區塊插在精選卡上方；analytics.ts CtaChannel 加 "map"
4. [x] 三大分區改分頁籤排版：REGIONS districts→groups（按行政區分組），tablist + fade-up 內容卡 + 分組 pill；tsc 0 errors
5. [ ] 截圖驗證（桌面 + 手機 375）+ vitest + checkpoint 交付

## 專案既有結構備忘
- Areas.tsx 有 REGIONS（78 區 pill 清單）、精選著陸頁卡、搜尋
- districtData.ts: DISTRICTS + DISTRICT_SLUGS + getDistrict()；districtData2.ts 額外 8 區
- 路由 /areas/:slug；顏色 token：navy #0b132b、wagreen #25d366、safety、mist
- dev server 用 vite（pnpm dev），dotenv ERR_MODULE_NOT_FOUND 為歷史非阻斷錯誤
