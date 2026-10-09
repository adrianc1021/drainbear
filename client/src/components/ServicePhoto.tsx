import { getServiceVisual } from "@/lib/serviceVisuals";

export default function ServicePhoto({ slug }: { slug: string }) {
  const visual = getServiceVisual(slug);
  return (
    <img
      className="service-photo"
      src={visual.src}
      alt={visual.alt}
      width="480"
      height="320"
      loading="lazy"
      decoding="async"
    />
  );
}
