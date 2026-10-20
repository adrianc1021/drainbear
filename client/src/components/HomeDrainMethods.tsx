import AnimatedDisclosure from "./AnimatedDisclosure";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const METHODS = [
  {
    name: "機械疏通",
    benefit: "處理局部淤塞",
    description:
      "機械疏通會按堵塞位置、喉管直徑、轉彎與入口選擇合適工具，處理局部積聚或淤塞。坐廁、鋅盤與浴室的管件不同，不會單靠加大力度處理；懷疑硬物、鬆脫或損壞時，先檢查，再確認是否需要拆裝。",
    href: "/services/toilet-unblocking",
  },
  {
    name: "高壓洗渠",
    benefit: "清理管段積聚物",
    description:
      "高壓洗渠利用水流清理管段積聚物，可按情況用於主渠或商業管道。施工前要了解喉管物料與狀況、可用入口、排水去向及污水處理安排。並非水壓越大越好，也不是每條舊喉或每個室內去水口都適合使用。",
    href: "/services/high-pressure-jetting",
  },
  {
    name: "CCTV 照渠",
    benefit: "查看管內情況",
    description:
      "CCTV 照渠以鏡頭查看可到達管段的內部情況，協助評估反覆淤塞或原因未明的問題。積水、油污、轉彎及入口大小會影響視野與可檢查距離，有時需先疏通或清理。影像檢查不等於疏通，檢查範圍與影像交付安排應事先確認。",
    href: "/services/cctv-drain-inspection",
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
        </div>
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
              <h3>
                <Link href={method.href}>
                  {method.name} <ArrowRight aria-hidden="true" />
                </Link>
              </h3>
              <p>{method.description}</p>
            </article>
          ))}
        </div>
        <AnimatedDisclosure
          id="home-method-details"
          title="安排工具進場前，需要確認甚麼？"
          className="home-method-details"
        >
          <p>
            堵塞位置、喉管物料及入口，決定適合的通渠方法；不是每宗工程都需要全部設備。查詢時可提供檢查口、櫃底與通道相片，說明有沒有樓梯、工作空間及管理處進場要求，方便確認工具如何到達施工位置。
          </p>
          <Link href="/blog/drain-tool-selection-guide">
            查看工具選擇指南 <ArrowRight aria-hidden="true" />
          </Link>
        </AnimatedDisclosure>
      </div>
    </section>
  );
}
