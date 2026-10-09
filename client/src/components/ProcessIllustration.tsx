const LABELS = [
  "白熊透過手機提供位置及現場相片",
  "白熊師傅攜帶工具箱上門",
  "白熊戴手套檢查喉口並記錄情況",
  "白熊操作通渠工具並測試去水",
];
export default function ProcessIllustration({ step }: { step: number }) {
  if (!LABELS[step]) throw new Error(`Missing process illustration: ${step}`);
  return (
    <span
      className={`home-arrangement__illustration home-arrangement__illustration--${step}`}
      role="img"
      aria-label={`AI 流程插圖：${LABELS[step]}`}
      data-process-illustration={step}
    >
      <img
        src="/images/drainbear-process-ai.webp"
        alt=""
        aria-hidden="true"
        width="1024"
        height="1024"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
