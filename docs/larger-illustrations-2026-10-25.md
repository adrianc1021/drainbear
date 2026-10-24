# 插圖放大 — 2026-10-25

依使用者回饋，取消段落插圖的浮動縮圖版面：手機以完整內容欄闊度展示，桌面最大 720px；原先 compact 文章圖最大 736px，不再限制至 170／230px 高。洗手盆封面亦保留自然高度。所有圖片保持比例，並同步 sizes，保留 lazy、預留尺寸及既有電話／WhatsApp 入口。

修改 SectionIllustration.tsx、ArticleFigure.tsx、brand-system.css；介面指引同步最新要求。屬版面修訂，未重寫內容或任意更新文章發布日期。

驗證：TypeScript、正式 build、8 個代表頁 × 320／390／768／1440px。手機可見段落圖片寬度至少 250px，核對圖片載入、無水平溢出、單一 H1、alt 與圖片區域 axe。證據位於 /workspace/drainbear-large-images-2026-10-25。
