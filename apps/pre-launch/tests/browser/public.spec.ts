import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const axe = require.resolve("axe-core/axe.min.js");
for (const width of [
  1920, 1672, 1440, 1366, 1280, 1024, 768, 430, 390, 360, 320,
]) {
  test(`hero and keyboard reflow at ${width} CSS px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 941 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Coming Soon" }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("list", { name: "Coming capabilities" })
        .getByRole("listitem"),
    ).toHaveText(["Marketplace", "Jobs", "Communication"]);
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("textbox", { name: "Email address" }),
    ).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
test("accessible page, HTML consent validation, restrictive headers and origin rejection", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  // Run inside the automation execution context, independent of page script policy.
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(axe, "utf8"),
  );
  const result = await page.evaluate(async (code) => {
    const api = (0, eval)(code + "\n;axe") as {
      run(opts: unknown): Promise<{ violations: { id: string }[] }>;
    };
    return await api.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
  }, source);
  expect(result.violations.map((x) => x.id)).toEqual([]);
  await expect(page.getByRole("checkbox")).toBeHidden();
  await expect(page.getByRole("link", { name: "Privacy notice" })).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Privacy & waitlist support" }),
  ).toHaveCount(0);
  await page.getByRole("textbox", { name: "Email address" }).focus();
  await expect(
    page.getByRole("link", { name: "Privacy notice" }),
  ).toBeVisible();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("browser@example.test");
  await page.getByRole("button", { name: "Notify Me" }).click();
  await expect(page.getByRole("checkbox")).toBeFocused();
  const unauthorized = await request.post("/api/v1/admin/campaigns", {
    headers: { Origin: "http://127.0.0.1:3001" },
    data: {},
  });
  expect(unauthorized.status()).toBe(401);
  const csrf = await request.post("/api/v1/waitlist/subscribe", {
    headers: { Origin: "https://other.test" },
    data: {},
  });
  expect(csrf.status()).toBe(403);
});

test("social preview renders all five symbols without inactive links", async ({
  page,
}) => {
  await page.goto("/?social-preview=1");
  const social = page.getByRole("navigation", {
    name: "Social media development preview",
  });
  await expect(social.getByText("Stay up to date")).toBeVisible();
  for (const name of [
    "Instagram",
    "LinkedIn",
    "GitHub",
    "YouTube",
    "Telegram",
  ]) {
    await expect(social.getByLabel(name + " preview")).toBeVisible();
  }
  await expect(social.getByRole("link")).toHaveCount(0);
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Social media development preview" }),
  ).toHaveCount(0);
});
