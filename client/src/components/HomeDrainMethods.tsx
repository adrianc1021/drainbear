import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const METHODS = [
  {
    name: "機械疏通",
    description:
      "按堵塞位置及喉管條件，使用合適工具處理局部淤塞。懷疑硬物或喉管損壞時，先檢查再決定處理方法。",
    href: "/services/toilet-unblocking",
    label: "了解坐廁淤塞處理",
  },
  {
    name: "高壓洗渠",
    description:
      "按管道物料、可用入口及現場條件，評估是否適合清理管段積聚物；也要考慮排水及污水處理安排。",
    href: "/services/high-pressure-jetting",
    label: "了解高壓洗渠服務",
  },
  {
    name: "CCTV 照渠",
    description:
      "協助查看鏡頭可到達位置的管內情況，適合評估反覆淤塞或原因未明的問題；影像檢查不等於疏通。",
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
          同樣是塞渠，堵塞位置、喉管物料及施工入口可能不同。團隊會先了解問題範圍，再選擇合適方法；機械疏通、高壓洗渠及
          CCTV 照渠各有用途，不是每宗工程都需要全部設備。
        </p>
        <div className="home-drain-methods__grid">
          {METHODS.map(method => (
            <article key={method.name}>
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
