import { createImageSrcSet, optimizedImageUrl } from "@/lib/imageOptimization";
import type { SanityImageData } from "@/lib/sanity/types";

/** Body images share responsive loading; portrait evidence keeps its whole frame. */
export default function ArticleFigure({ image }: { image: SanityImageData }) {
  if (!image.url) return null;
  const portrait = Boolean(
    image.width && image.height && image.height > image.width
  );
  return (
    <figure
      className={`mt-8 ${image.presentation === "compact" ? "article-figure--compact" : ""}`}
      data-article-figure="true"
    >
      <img
        src={optimizedImageUrl(image.url, 1200)}
        srcSet={
          image.srcSet || createImageSrcSet(image.url, [480, 768, 960, 1200])
        }
        sizes={
          image.presentation === "compact"
            ? "(min-width: 768px) 736px, calc(100vw - 32px)"
            : portrait
              ? "(min-width: 368px) 336px, calc(100vw - 32px)"
              : "(min-width: 768px) 736px, calc(100vw - 32px)"
        }
        alt={image.alt || ""}
        width={image.width}
        height={image.height}
        className={
          portrait
            ? "mx-auto h-auto max-h-[28rem] w-auto max-w-full rounded-lg object-contain"
            : "h-auto w-full rounded-lg"
        }
        loading="lazy"
        decoding="async"
      />
      {image.caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
