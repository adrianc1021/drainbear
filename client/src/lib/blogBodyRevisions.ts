import type { PortableTextBlock } from "@portabletext/types";
import type { SanityBlogBodyBlock } from "./sanity/types";

/** Website-only additions preserve the original CMS paragraphs, images and dates. */
export const BLOG_BODY_REVISION_DATE = "2026-10-12";
export const WASHING_MACHINE_MESSAGE =
  "您好，我想查詢洗衣機去水倒灌。地區：＿＿；倒灌位置（洗衣機接口／地台去水／洗手盆／其他）：＿＿；其他去水位是否異常：＿＿。我會提供安全拍攝的相片或現有短片；請先了解處理方向及可安排時間。";
export const BODY_REVISION_SLUGS = [
  "cctv-drain-inspection-hong-kong-guide",
  "washing-machine-drain-backflow-causes-fixes",
];

function appendServiceLink(
  body: SanityBlogBodyBlock[],
  key: string,
  match: string,
  lead: string,
  label: string,
  href: string
): SanityBlogBodyBlock[] {
  if (
    body.some(
      block =>
        block._type === "block" &&
        (block as PortableTextBlock).markDefs?.some(
          mark =>
            mark._type === "link" &&
            (mark.href === href ||
              mark.href === `https://drainbearhk.com${href}`)
        )
    )
  )
    return body;
  const blocks = body.slice();
  const index = blocks.findIndex(
    block =>
      block._type === "block" &&
      (block._key === key ||
        ((block as PortableTextBlock).style === "normal" &&
          (block as PortableTextBlock).children
            .map(span => span.text ?? "")
            .join("")
            .includes(match)))
  );
  const anchor = `service-link-${href.split("/").pop()}`;
  const children = [
    { _type: "span", _key: `${anchor}-lead`, text: lead, marks: [] },
    { _type: "span", _key: `${anchor}-text`, text: label, marks: [anchor] },
    { _type: "span", _key: `${anchor}-end`, text: "。", marks: [] },
  ];
  const definition = { _type: "link", _key: anchor, href };
  if (index < 0) {
    blocks.push({
      _type: "block",
      _key: anchor,
      style: "normal",
      children,
      markDefs: [definition],
    });
  } else {
    const block = blocks[index] as PortableTextBlock;
    blocks[index] = {
      ...block,
      children: [...block.children, ...children],
      markDefs: [...(block.markDefs ?? []), definition],
    };
  }
  return blocks;
}

export function reviseBlogBody(
  slug: string,
  original: SanityBlogBodyBlock[]
): SanityBlogBodyBlock[] {
  if (slug === "cctv-drain-inspection-hong-kong-guide") {
    return appendServiceLink(
      original,
      "9d598fec7fca",
      "如渠道反覆淤塞而原因未明",
      "預約前可先",
      "了解 CCTV 照渠服務",
      "/services/cctv-drain-inspection"
    );
  }
  if (slug === "washing-machine-drain-backflow-causes-fixes") {
    const bathroom = appendServiceLink(
      original,
      "3ab44544e05f",
      "洗衣機、洗手盆和地台去水有時共用",
      "地台去水冒水或浴室支渠受影響，可",
      "了解浴室通渠的處理範圍",
      "/services/bathroom-drain-unblocking"
    );
    return appendServiceLink(
      bathroom,
      "2d7b58d33605",
      "若多個去水位同時咕嚕作響",
      "多處或多戶同時倒灌，可先查看",
      "污水倒灌處理與共用渠安排",
      "/services/sewage-backflow"
    );
  }
  return original;
}

export function latestEditorialDate(
  original: string | undefined,
  revision: string
): string {
  return original && Date.parse(original) > Date.parse(revision)
    ? original
    : revision;
}
