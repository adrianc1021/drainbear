import AnimatedDisclosure from "./AnimatedDisclosure";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const METHODS = [
  {
    name: "機械疏通",
    benefit: "處理局部淤塞",
    description:
      "按堵塞位置及喉管條件處理局部淤塞；懷疑硬物或喉管損壞，先檢查。",
    href: "/services/toilet-unblocking",
  },
  {
    name: "高壓洗渠",
    benefit: "清理管段積聚物",
    description:
      "按喉管物料、入口及現場排水、污水處理條件，評估是否適合清理管段積聚物。",
    href: "/services/high-pressure-jetting",
  },
  {
    name: "CCTV 照渠",
    benefit: "查看管內情況",
    description:
      "查看鏡頭可到達位置的管內情況，協助了解反覆淤塞；照渠不等於疏通。",
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
              <p>{method.benefit}</p>
            </article>
          ))}
        </div>
        <AnimatedDisclosure
          id="home-method-details"
          title="適用情況及設備限制"
          className="home-method-details"
        >
          <p>
            堵塞位置、喉管物料及入口，決定適合的通渠方法；不是每宗工程都需要全部設備。
          </p>
          <dl>
            {METHODS.map(method => (
              <div key={method.name}>
                <dt>{method.name}</dt>
                <dd>{method.description}</dd>
              </div>
            ))}
          </dl>
          <Link href="/blog/drain-tool-selection-guide">
            查看工具選擇指南 <ArrowRight aria-hidden="true" />
          </Link>
        </AnimatedDisclosure>
      </div>
    </section>
  );
}
