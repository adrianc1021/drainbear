import {createClient} from "@sanity/client";
import {createImageUrlBuilder} from "@sanity/image-url";

export const sanityConfig = {
  projectId: "oyph9zy1",
  dataset: "production",
  apiVersion: "2025-02-19",
  useCdn: true,
  perspective: "published",
} as const;

export const sanityClient = createClient(sanityConfig);

const imageBuilder = createImageUrlBuilder(sanityClient);

export function sanityImage(
  source: Parameters<typeof imageBuilder.image>[0]
) {
  return imageBuilder.image(source);
}
