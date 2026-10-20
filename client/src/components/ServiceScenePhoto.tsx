type Scene = "restaurant-drains" | "bathroom-preparation" | "drain-inspection-guide";

const DESCRIPTIONS: Record<Scene, string> = {
  "restaurant-drains": "食肆廚房的不鏽鋼鋅盤、櫃底去水喉及地台去水口",
  "bathroom-preparation": "浴室洗手盆櫃底預留檢查空間，工具與保護墊放在旁邊",
  "drain-inspection-guide": "工作人員在鋅盤櫃底用手電筒查看去水喉",
};

export default function ServiceScenePhoto({ scene }: { scene: Scene }) {
  return (
    <figure className="service-scene-photo">
      <img
        src={`/images/home/${scene}-960.webp`}
        srcSet={`/images/home/${scene}-640.webp 640w, /images/home/${scene}-960.webp 960w, /images/home/${scene}-1536.webp 1536w`}
        sizes="(min-width: 1024px) 60vw, 100vw"
        width={1536}
        height={1024}
        loading="lazy"
        decoding="async"
        alt={DESCRIPTIONS[scene]}
      />
    </figure>
  );
}
