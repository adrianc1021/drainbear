import type { PortableTextBlock } from "@portabletext/types";
import type { BlogPost } from "./blogData";
import type { SanityBlogBodyBlock, SanityImageData } from "./sanity/types";
import { ARTICLE_IMAGES } from "./articleImages";
import { ARTICLE_ILLUSTRATIONS } from "./articleIllustrationPlan";

function imageIdentity(url = "") {
  return url.split("?")[0].replace(/-(640|960)(?=\.webp$)/, "");
}

/** Never mutate CMS text or insert after a guessed section. Repeat mapping is safe. */
function insertImages<T>(
  slug: string,
  original: T[],
  cover: string | undefined,
  read: (block: T) => { heading?: string; text?: string; image?: string },
  create: (image: SanityImageData, key: string) => T
): T[] {
  const placements = ARTICLE_ILLUSTRATIONS[slug];
  if (!placements) return original;
  const seen = new Set([imageIdentity(cover)]);
  for (const block of original) {
    const source = read(block).image;
    if (source) seen.add(imageIdentity(source));
  }
  let result = original;
  for (let index = 0; index < placements.length; index++) {
    const placement = placements[index];
    const image = ARTICLE_IMAGES[placement.image];
    const identity = imageIdentity(image.url);
    if (seen.has(identity)) continue;
    const anchor = result.findIndex(block => {
      const content = read(block);
      return "afterHeading" in placement
        ? content.heading === placement.afterHeading
        : content.text?.startsWith(placement.afterText);
    });
    if (anchor < 0) continue;
    let insertion = anchor + 1;
    if ("afterHeading" in placement)
      while (insertion < result.length && !read(result[insertion]).heading)
        insertion++;
    if (result === original) result = original.slice();
    result.splice(insertion, 0, create(image, `editorial-${slug}-${index}`));
    seen.add(identity);
  }
  return result;
}

export function illustrateStaticSections(
  slug: string,
  sections: BlogPost["sections"],
  cover?: string
) {
  return insertImages(
    slug,
    sections,
    cover,
    section => ({
      heading: section.type === "h2" ? section.text : undefined,
      text: section.type === "p" ? section.text : undefined,
      image: section.type === "image" ? section.image.url : undefined,
    }),
    image => ({ type: "image" as const, image })
  );
}

export function illustratePortableBody(
  slug: string,
  body: SanityBlogBodyBlock[],
  cover?: string
) {
  return insertImages(
    slug,
    body,
    cover,
    block => {
      if (block._type === "articleImage")
        return { image: "url" in block ? block.url : undefined };
      if (block._type !== "block") return {};
      const textBlock = block as PortableTextBlock;
      const text = textBlock.children.map(span => span.text ?? "").join("");
      return {
        heading: textBlock.style === "h2" ? text : undefined,
        text: textBlock.style !== "h2" ? text : undefined,
      };
    },
    (image, key) => ({ ...image, _type: "articleImage" as const, _key: key })
  );
}
