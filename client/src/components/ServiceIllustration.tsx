const SCENES: Record<string, { column: number; row: number; label: string }> = {
  "toilet-unblocking": { column: 0, row: 0, label: "坐廁通渠" },
  "kitchen-sink-unblocking": { column: 1, row: 0, label: "廚房鋅盤" },
  "bathroom-drain-unblocking": { column: 2, row: 0, label: "浴室去水" },
  "sewage-backflow": { column: 3, row: 0, label: "倒灌管道示意" },
  "grease-trap-cleaning": { column: 0, row: 1, label: "隔油池檢查" },
  "high-pressure-jetting": { column: 1, row: 1, label: "高壓水槍洗渠" },
  "cctv-drain-inspection": { column: 2, row: 1, label: "照喉設備" },
  "main-drain-manhole": { column: 3, row: 1, label: "主渠及沙井檢視" },
};

/** Clean service illustrations for browsing, separate from case evidence. */
export default function ServiceIllustration({
  slug,
  compact = false,
  sizes = "112px",
}: {
  slug: string;
  compact?: boolean;
  sizes?: string;
}) {
  const scene = SCENES[slug];
  if (!scene) throw new Error(`Missing service illustration: ${slug}`);
  return (
    <span
      className="service-illustration"
      role="img"
      aria-label={`AI 紙藝白熊服務插圖：${scene.label}`}
      data-service-illustration={slug}
    >
      <span className="service-illustration__scene">
        <img
          src={
            compact
              ? `/images/services/${slug}-224.webp`
              : "/images/drainbear-services-ai.webp"
          }
          srcSet={
            compact
              ? `/images/services/${slug}-224.webp 224w, /images/services/${slug}-384.webp 384w`
              : undefined
          }
          sizes={compact ? sizes : undefined}
          alt=""
          aria-hidden="true"
          width={compact ? 224 : 1536}
          height={compact ? 224 : 768}
          loading="lazy"
          decoding="async"
          style={
            compact
              ? { width: "100%", height: "100%", top: 0, left: 0 }
              : {
                  left: `${-100 * scene.column}%`,
                  transform: `translateY(-${scene.row ? 75 : 25}%)`,
                }
          }
        />
      </span>
    </span>
  );
}
