import { test, expect } from "@playwright/test";

for (const firstError of ["challenge_expired", "unavailable"]) {
  test(`only an expired challenge retries enrollment (${firstError})`, async ({
    page,
  }) => {
    const tokens: string[] = [];
    await page.route(
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
      (route) =>
        route.fulfill({
          contentType: "application/javascript",
          body: `
          let options, execution = 0;
          window.turnstile = {
            render(element, widget) {
              options = widget;
              element.dataset.widgetReady = "true";
              return "fixture";
            },
            reset() {},
            execute() { options.callback("browser-fixture-" + (++execution)); }
          };
        `,
        }),
    );
    await page.route("**/api/v1/waitlist/subscribe", async (route) => {
      const data = route.request().postDataJSON();
      expect(data.email).toBe("browser@example.test");
      expect(data.consent).toBe(true);
      tokens.push(data.challengeToken);
      if (tokens.length === 1) {
        await route.fulfill({
          status: firstError === "challenge_expired" ? 400 : 503,
          json: { error: { code: firstError } },
        });
        return;
      }
      await route.fulfill({ status: 202, json: {} });
    });
    await page.goto("/");
    await expect(page.locator("[data-widget-ready]")).toHaveCount(1);
    const email = page.getByRole("textbox", { name: "Email address" });
    await email.fill("browser@example.test");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Notify Me" }).click();
    if (firstError === "challenge_expired") {
      await expect(page.getByRole("status")).toContainText(
        "a confirmation email will arrive shortly",
      );
      expect(tokens).toEqual(["browser-fixture-1", "browser-fixture-2"]);
    } else {
      await expect(page.getByRole("status")).toContainText(
        "Registration is temporarily unavailable",
      );
      expect(tokens).toEqual(["browser-fixture-1"]);
      await expect(email).toHaveValue("browser@example.test");
    }
  });
}
