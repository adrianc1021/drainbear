import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const METHODS = [
  {
    name: "機械疏通",
    description:
      "按堵塞位置及喉管條件處理局部淤塞；懷疑硬物或喉管損壞，先檢查。",
    href: "/services/toilet-unblocking",
    label: "了解坐廁淤塞處理",
  },
  {
    name: "高壓洗渠",
    description:
      "按喉管物料、入口及現場排水、污水處理條件，評估是否適合清理管段積聚物。",
    href: "/services/high-pressure-jetting",
    label: "了解高壓洗渠服務",
  },
  {
    name: "CCTV 照渠",
    description:
      "查看鏡頭可到達位置的管內情況，協助了解反覆淤塞；照渠不等於疏通。",
    href: "/services/cctv-drain-inspection",
    label: "了解 CCTV 照渠服務",
  },
];

export default function HomeDrainMethods() {
  return (
    <section
      className="brand-section home-drain-methods"
      aria-labelledby="home-methods-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <h2 id="home-methods-heading">通渠方法點樣揀？</h2>
          </div>
          <Link href="/blog/drain-tool-selection-guide">
            查看工具選擇指南 <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <p className="section-heading-description">
          堵塞位置、喉管物料及入口，決定適合的通渠方法；不是每宗工程都需要全部設備。
        </p>
        <div className="home-drain-methods__grid">
          {METHODS.map((method, index) => (
            <article key={method.name} className="reveal">
              <img
                src={`/images/home/method-${index}.webp`}
                width="420"
                height="260"
                loading="lazy"
                decoding="async"
                alt={`${method.name}設備示意插圖`}
              />
              <h3>{method.name}</h3>
              <p>{method.description}</p>
              <Link href={method.href}>
                {method.label} <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
