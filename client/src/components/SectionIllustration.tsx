import { ARTICLE_IMAGES } from "@/lib/articleImages";
export type IllustrationScene = Exclude<
  keyof typeof ARTICLE_IMAGES,
  "basinCase" | "schoolCase"
>;
/** Brand illustrations explain a section; never used as records of a real job. */
export default function SectionIllustration({
  scene,
}: {
  scene: IllustrationScene;
}) {
  const image = ARTICLE_IMAGES[scene];
  return (
    <figure className="section-illustration" data-section-illustration={scene}>
      <img
        src={image.url?.replace(/\.webp$/, "-640.webp")}
        srcSet={image.srcSet}
        sizes="(max-width: 767px) 132px, 240px"
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
