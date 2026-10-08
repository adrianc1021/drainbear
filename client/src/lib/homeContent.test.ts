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
    expect(html.indexOf("24小時特快通渠熱線")).toBeLessThan(
      html.indexOf('id="home-services-heading"')
    );
    expect(html).toContain("上門時間按地區、人手及設備確認");
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
    expect(html).not.toContain('data-cms-loading="true"');
    expect(html).not.toContain('data-pr20-section="photo-quote"');
  });

  it("keeps accurate image alt text and FAQ answers without visible illustration badges", () => {
    const html = renderHome();
    expect(html).not.toContain("服務示意圖，非客戶工程紀錄。");
    expect(html).toContain("白色紙藝通渠熊、香港天際線及渠務工具的品牌示意");
    expect(html).toContain('width="1536" height="1024"');
    expect(html).toContain("drainbear-paper-hero-640.webp 640w");
    expect(html).toContain("可以先知道大概收費嗎？");
    expect(html).toContain("團隊會按實際情況說明報價");
    expect(html).not.toContain("線上表格暫時維護中");
    expect(html).not.toContain("HK$");
    expect(html.indexOf('id="home-recorded-cases-heading"')).toBeGreaterThan(0);
    expect(html.indexOf('id="home-recorded-cases-heading"')).toBeLessThan(
      html.indexOf('id="home-process-heading"')
    );
    expect(html).not.toContain('src="undefined"');
  });
});
