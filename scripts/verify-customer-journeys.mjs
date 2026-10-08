import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import { CASE_SERVICE_RELATIONS } from "../shared/caseServiceRelations.ts";
import { CUSTOMER_JOURNEYS } from "../shared/customerJourneys.ts";
import { enableCmsRelay } from "./browser-cms-relay.ts";

const server = spawn(process.execPath, ["dist/index.js"], {
  env: { ...process.env, NODE_ENV: "production", PORT: "4570" },
  stdio: ["ignore", "pipe", "pipe"],
});
const ready = new Promise((resolve, reject) => {
  const timer = setTimeout(
    () => reject(new Error("Customer preview startup timeout")),
    30000
  );
  server.stdout.on("data", data => {
    const match = String(data).match(
      /Server running on (http:\/\/localhost:\d+)/
    );
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
  server.once("error", error => {
    clearTimeout(timer);
    reject(error);
  });
});
const output =
  process.env.JOURNEY_REVIEW_OUTPUT || "/tmp/drainbear-journey-review";
await fs.mkdir(output, { recursive: true });
let browser;
try {
  const origin = await ready;
  const response = await fetch(origin + "/knowledge.json");
  assert.equal(response.status, 200);
  const knowledge = await response.json();
  const byPath = new Map(
    knowledge.pages.map(page => [new URL(page.url).pathname, page])
  );
  assert.equal(
    knowledge.companyFacts.source,
    "https://drainbearhk.com/about#company-facts"
  );
  assert.equal(
    knowledge.companyFacts.telephone,
    knowledge.organization.telephone
  );
  assert(knowledge.coverage.uniqueQuestions <= knowledge.coverage.answers);
  for (const page of knowledge.pages) {
    assert(!page.text.includes("線上表格暫時維護中"), page.url);
    assert(!page.text.includes("您的瀏覽器未能播放影片"), page.url);
  }
  for (const relation of CASE_SERVICE_RELATIONS) {
    const service = byPath.get(`/services/${relation.serviceSlug}`);
    const study = byPath.get(`/cases/${relation.caseSlug}`);
    assert(
      service.links.includes(study.url),
      "service must directly link to reviewed record"
    );
    assert(
      study.links.includes(service.url),
      "case must link back to applicable service"
    );
    assert(
      service.text.includes(relation.note),
      "relationship qualification must remain visible"
    );
  }
  for (const customer of CUSTOMER_JOURNEYS) {
    const page = byPath.get(`/customers/${customer.slug}`);
    assert(page);
    for (const item of customer.checklist) assert(page.text.includes(item));
  }
  assert(!byPath.get("/guide").text.includes("HK$"));
  assert(
    !JSON.stringify(byPath.get("/guide").structuredData).includes(
      "priceSpecification"
    )
  );
  browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 667 },
    reducedMotion: "reduce",
  });
  await enableCmsRelay(context, origin);
  await context.route(
    /https:\/\/(?:www\.googletagmanager\.com|.*google-analytics\.com)\//,
    route => route.abort()
  );
  // Intercept only the test popup, without sending a WhatsApp message.
  await context.route("https://wa.me/**", route =>
    route.fulfill({ status: 200, body: "WhatsApp navigation test" })
  );
  const page = await context.newPage();
  await page.goto(origin + "/thanks");
  await page.locator("main h1").waitFor();
  assert(!(await page.locator("main").innerText()).includes("對話已開啟"));
  assert.match(
    await page.locator('meta[name="robots"]').getAttribute("content"),
    /noindex/
  );
  assert.equal(
    await page.evaluate(
      () =>
        (window.dataLayer || []).filter(
          item => item.event === "whatsapp_handoff"
        ).length
    ),
    0
  );
  await page.goto(origin + "/customers/property-management");
  await page.locator("main h1").waitFor();
  const target = page.locator("[data-contact-panel] .contact-action--whatsapp");
  assert(
    decodeURIComponent(await target.getAttribute("href")).includes(
      "受影響樓層或範圍"
    )
  );
  const popupPromise = page.waitForEvent("popup");
  await target.click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  assert(popup.url().startsWith("https://wa.me/"));
  await page.waitForURL("**/thanks?from=**");
  await page.waitForFunction(
    () =>
      (window.dataLayer || []).filter(item => item.event === "whatsapp_handoff")
        .length === 1
  );
  const events = await page.evaluate(() =>
    (window.dataLayer || []).filter(item => item.event).map(item => item.event)
  );
  assert.equal(events.filter(name => name === "whatsapp_click").length, 1);
  assert.equal(events.filter(name => name === "whatsapp_handoff").length, 1);
  assert(
    !events.some(name =>
      [
        "whatsapp_open",
        "inquiry_received",
        "qualified_lead",
        "job_completed",
      ].includes(name)
    )
  );
  await page.reload();
  await page.locator("main h1").waitFor();
  assert.equal(
    await page.evaluate(
      () =>
        (window.dataLayer || []).filter(
          item => item.event === "whatsapp_handoff"
        ).length
    ),
    0
  );
  await page.screenshot({ path: `${output}/thanks-390.png`, fullPage: true });
  await fs.writeFile(
    `${output}/journey-checks.json`,
    JSON.stringify(
      {
        indexablePages: knowledge.coverage.indexablePages,
        reviewedRelations: CASE_SERVICE_RELATIONS.length,
        customerJourneys: 3,
        knowledgeClean: true,
        contextualLinks: true,
        whatsappClick: 1,
        handoff: 1,
        noFalseReceiptEvents: true,
        reloadHandoff: 0,
      },
      null,
      2
    )
  );
  console.log(
    "PASS customer checklists, reviewed bidirectional case links, company source, clean AEO text and WhatsApp handoff deduplication; actual app opening/messages and business outcomes remain unverified."
  );
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
