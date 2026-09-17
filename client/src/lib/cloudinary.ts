const CLOUDINARY_UPLOAD_RE =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i;

export const SERVICE_IMAGE_WIDTHS = [480, 768, 960, 1200] as const;

/**
 * Add a responsive Cloudinary transformation without changing local assets.
 * The source images used by service pages are 3:2, so an explicit height
 * keeps the crop stable while allowing Cloudinary to negotiate WebP/AVIF.
 */
export function cloudinaryImageUrl(
  source: string,
  width: number,
  height = Math.round((width * 2) / 3)
) {
  const match = source.match(CLOUDINARY_UPLOAD_RE);
  if (!match) return source;

  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));
  const transformation = `f_auto,q_auto:eco,c_fill,w_${safeWidth},h_${safeHeight}`;

  return `${match[1]}${transformation}/${match[2]}`;
}

export function cloudinaryImageSrcSet(
  source: string,
  widths: readonly number[] = SERVICE_IMAGE_WIDTHS
) {
  if (!CLOUDINARY_UPLOAD_RE.test(source)) return undefined;

  return widths
    .map(width => `${cloudinaryImageUrl(source, width)} ${width}w`)
    .join(", ");
}
