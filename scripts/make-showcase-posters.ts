/**
 * Takes the small picture shown on the designs page before a visitor opens the
 * live preview: each layout on its demo site, with the opening skipped.
 *
 *   BASE_URL=http://localhost:3000 PUPPETEER_DIR=/path/with/node_modules \
 *     npx tsx scripts/make-showcase-posters.ts [layout ...]
 *
 * Needs the demo sites seeded (pnpm db:seed:example showcase-wedding demo-wedding
 * --publish, and the same for graduation, birthday and christening), the app
 * running, and puppeteer-core installed in PUPPETEER_DIR (it is not a
 * dependency of this repo). Uses the system Chrome.
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { SHOWCASE, previewHref } from "../src/lib/showcase";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outDir = join(__dirname, "..", "public", "showcase", "posters");
const only = new Set(process.argv.slice(2));

/** Just the parts of puppeteer-core this script calls; the package itself is installed outside the repo. */
type Page = {
  setViewport(size: { width: number; height: number; deviceScaleFactor: number }): Promise<void>;
  emulateMediaFeatures(features: { name: string; value: string }[]): Promise<void>;
  evaluateOnNewDocument(fn: (slug: string) => void, slug: string): Promise<void>;
  goto(url: string, options: { waitUntil: string; timeout: number }): Promise<unknown>;
  screenshot(options: { path: string; type: "webp"; quality: number }): Promise<unknown>;
  close(): Promise<void>;
};
type Browser = { newPage(): Promise<Page>; close(): Promise<void> };
type Puppeteer = { launch(options: { executablePath: string; headless: boolean }): Promise<Browser> };

async function main() {
  const require = createRequire(join(process.env.PUPPETEER_DIR ?? process.cwd(), "noop.js"));
  const puppeteer = require("puppeteer-core") as Puppeteer;
  mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
  try {
    for (const design of SHOWCASE) {
      if (only.size && !only.has(design.layout)) continue;
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 807, deviceScaleFactor: 1 });
      // A still page: no entrance animation left half-played in the picture.
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await page.evaluateOnNewDocument((slug) => sessionStorage.setItem(`invitation-opened:${slug}`, "1"), design.demoSlug);
      const href = previewHref(design, { theme: design.defaultTheme, opening: design.defaultOpening }).replace("&replay=1", "");
      await page.goto(base + href, { waitUntil: "networkidle2", timeout: 120_000 });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await page.screenshot({ path: join(outDir, `${design.layout}.webp`), type: "webp", quality: 72 });
      console.log("poster", design.layout);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
