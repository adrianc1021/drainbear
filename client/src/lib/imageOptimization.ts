const SANITY_HOST = "cdn.sanity.io";

function normalizeWidth(width: number) {
  return Math.max(1, Math.round(width));
}

/**
 * 為 Sanity CDN 圖片加入尺寸、壓縮及現代格式參數。
 *
 * 非 Sanity 圖片維持原 URL，避免意外改寫其他圖片服務。
 */
export function optimizedImageUrl(source: string, width: number, quality = 82) {
  if (!source) {
    return source;
  }

  try {
    const url = new URL(source);

    if (url.hostname !== SANITY_HOST) {
      return source;
    }

    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    url.searchParams.set("w", String(normalizeWidth(width)));
    url.searchParams.set("q", String(Math.min(100, Math.max(1, quality))));

    return url.toString();
  } catch {
    return source;
  }
}

/**
 * 建立響應式圖片 srcset。
 *
 * 瀏覽器會按畫面寬度及像素密度，自動選擇最合適圖片，
 * 避免手機直接下載 Sanity 原始 5000px 圖片。
 */
export function createImageSrcSet(
  source: string,
  widths: number[],
  quality = 82
) {
  if (!source) {
    return undefined;
  }

  try {
    const url = new URL(source);

    if (url.hostname !== SANITY_HOST) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  const uniqueWidths = Array.from(
    new Set(widths.map(normalizeWidth).filter(width => width > 0))
  ).sort((a, b) => a - b);

  return uniqueWidths
    .map(width => `${optimizedImageUrl(source, width, quality)} ${width}w`)
    .join(", ");
}
