import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const [directory = "artifacts/screenshots", ...flags] = process.argv.slice(2);
const url = new URL("http://127.0.0.1:3001");
if (flags.includes("--social-preview"))
  url.searchParams.set("social-preview", "1");

const installed = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({
  executablePath: existsSync(installed) ? installed : undefined,
});
await mkdir(directory, { recursive: true });
try {
  const sizes = [
    [1920, 1080],
    [1672, 941],
    [1440, 900],
    [1366, 768],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [430, 932],
    [390, 844],
    [360, 800],
    [320, 740],
  ];
  for (const [width, height] of sizes) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      isMobile: width <= 430,
      hasTouch: width <= 430,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(url.origin + "/art/") && !response.ok())
        errors.push("Art request failed with HTTP " + response.status());
    });
    await page.goto(url.href, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Coming Soon" }).waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images]
          .filter((image) => image.getClientRects().length)
          .map((image) => image.decode()),
      );
    });
    await page.screenshot({
      path: `${directory}/${width}x${height}.png`,
      fullPage: true,
      animations: "disabled",
    });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    if (overflow || errors.length)
      throw new Error(
        `${width}px overflow=${overflow} errors=${errors.join(",")}`,
      );
    await page.close();
  }
} finally {
  await browser.close();
}
