import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { SERVICE_PAGES } from "@/lib/serviceData";
import Home from "@/pages/Home";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";

function renderHome() {
  return renderToStaticMarkup(
    React.createElement(
      Router,
      { ssrPath: "/" },
      React.createElement(SiteSettingsProvider, null, React.createElement(Home))
    )
  );
}

describe("homepage contact and discovery", () => {
  it("provides the requested hotline and WhatsApp destinations before the service directory", () => {
    const html = renderHome();
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('href="tel:+85295588260"');
    expect(html).toContain('href="https://wa.me/85295588260?');
    expect(html.indexOf("24小時通渠查詢")).toBeLessThan(
      html.indexOf('id="home-services-heading"')
    );
    expect(html).toContain("實際上門時間會按地區、交通、人手及設備供應確認");
  });

  it("keeps service, customer and content paths discoverable without a homepage CMS article feed", () => {
    const html = renderHome();
    for (const service of SERVICE_PAGES)
      expect(html).toContain(`href="/services/${service.slug}"`);
    for (const path of [
      "/areas",
      "/guide",
      "/service-process",
      "/faq",
      "/cases",
      "/blog",
      "/drain-diagnosis",
    ])
      expect(html).toContain(`href="${path}"`);
    for (const customer of ["住宅住戶", "食肆及商舖", "業主及物業管理"])
      expect(html).toContain(customer);
    // The two completed records now await published CMS evidence; the service
    // and article entrances remain in HTML independently of that request.
    expect(html).toContain('class="home-case-evidence"');
    expect(html).not.toContain('data-pr20-section="photo-quote"');
  });

  it("keeps accurate image alt text and FAQ answers without visible illustration badges", () => {
    const html = renderHome();
    expect(html).not.toContain("服務示意圖，非客戶工程紀錄。");
    expect(html).toContain(
      "品牌示意：白熊戴安全帽、手持工具，站在香港夜景與流動渠水前"
    );
    expect(html).toContain('width="1685" height="933"');
    expect(html).toContain("light-water-mobile-640.webp 640w");
    expect(html).toContain("可以先知道大概收費嗎？");
    expect(html).toContain("隱藏管段及實際堵塞原因，仍可能需要現場檢查");
    expect(html).not.toContain("線上表格暫時維護中");
    expect(html).not.toContain("HK$");
    expect(html.indexOf('id="home-recorded-cases-heading"')).toBeGreaterThan(0);
    expect(html.indexOf('id="home-recorded-cases-heading"')).toBeLessThan(
      html.indexOf('id="home-process-heading"')
    );
    expect(html).not.toContain('src="undefined"');
  });
});
