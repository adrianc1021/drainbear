// Regression for a heading whose generic ink rule overrode its white-on-ink
// section. This checks solid homepage surfaces, not every accessibility rule.
import { chromium, webkit } from "playwright";

const base = process.env.HOME_BASE_URL || "http://127.0.0.1:4173";
for (const [name, engine] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      await context.route(
        /google-analytics|googletagmanager|googleadservices/,
        route => route.abort()
      );
      const page = await context.newPage();
      await page.goto(`${base}/`, { waitUntil: "networkidle" });
      const failures = await page
        .locator("main h1, main h2, main h3")
        .evaluateAll(headings => {
          const rgb = value => {
            if (!/^rgba?\(/.test(value))
              throw new Error(`Unsupported test colour: ${value}`);
            const values = value.match(/[\d.]+/g).map(Number);
            return [...values.slice(0, 3), values[3] ?? 1];
          };
          const luminance = colour =>
            colour
              .slice(0, 3)
              .map(v => {
                const s = v / 255;
                return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
              })
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
          return headings.flatMap(heading => {
            if (!heading.getBoundingClientRect().width) return [];
            let background = [255, 255, 255, 1];
            for (
              let ancestor = heading;
              ancestor;
              ancestor = ancestor.parentElement
            ) {
              const colour = rgb(getComputedStyle(ancestor).backgroundColor);
              if (colour[3] === 1) {
                background = colour;
                break;
              }
            }
            const foreground = rgb(getComputedStyle(heading).color);
            const visible = foreground
              .slice(0, 3)
              .map(
                (v, i) =>
                  v * foreground[3] + background[i] * (1 - foreground[3])
              );
            const a = luminance(visible),
              b = luminance(background);
            const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            return ratio < 3
              ? [`${heading.textContent}: ${ratio.toFixed(2)}:1`]
              : [];
          });
        });
      if (failures.length)
        throw new Error(
          `${name} ${width}px heading contrast: ${failures.join("; ")}`
        );
      console.log(`PASS: ${name} ${width}px homepage heading contrast`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
