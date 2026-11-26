import { test, expect } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { loadEnvFile } from "node:process";
import { lookup, unseal } from "../../src/lib/security/crypto";

test("official Turnstile test keys and real email verification, opt-out, and worker capture", async ({
  page,
  request,
}) => {
  test.setTimeout(75_000);
  loadEnvFile(process.env.PRELAUNCH_TEST_ENV_FILE ?? ".env.local");
  const directory = process.env.WAITLIST_LOCAL_DIRECTORY;
  if (!directory || process.env.BLOB_READ_WRITE_TOKEN)
    throw new Error("An isolated local JSON directory is required");
  const address = "Browser-" + randomUUID() + "@example.test";
  const identity = lookup(address);
  const dispatch = async () => {
    const result = await request.get("/api/v1/internal/cron/delivery", {
      headers: { Authorization: "Bearer " + process.env.CRON_SECRET },
    });
    expect(result.status()).toBe(204);
  };
  const capture = async (kind: string) => {
    const captures = join(directory, "captured-mail");
    const names = await readdir(captures).catch(() => []);
    for (const name of names) {
      const id = name.replace(/\.json$/, "");
      const { message } = JSON.parse(
        await readFile(join(captures, name), "utf8"),
      );
      const mail = JSON.parse(unseal(message, "waitlist-mail:" + id));
      if (mail.to === address && mail.text.includes(kind))
        return mail.text as string;
    }
  };
  const status = async () => {
    const snapshot = await readFile(join(directory, "waitlist.json"), "utf8");
    expect(snapshot).not.toContain(address);
    return JSON.parse(snapshot).subscribers[identity]?.state;
  };
  await page.goto("/");
  await page.waitForFunction(() => Boolean(window.turnstile));
  await page.getByRole("textbox", { name: "Email address" }).fill(address);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Notify Me" }).click();
  await expect(page.getByRole("status")).toContainText(
    "a confirmation email will arrive shortly",
    { timeout: 15_000 },
  );
  expect(await status()).toBe("PENDING");
  await dispatch();
  await expect.poll(() => capture("/verify#")).toBeDefined();
  const verify = (await capture("/verify#"))?.match(
    /http:\/\/[^\s]+\/verify#[0-9a-f.]+/,
  )?.[0];
  expect(verify).toBeDefined();
  await page.goto(verify!);
  await expect(page.getByLabel("Confirmation code")).toHaveValue(
    /^[a-f0-9.]{97}$/,
  );
  expect(await status()).toBe("PENDING");
  await page.getByRole("button", { name: "Confirm email" }).click();
  await expect(page.getByRole("status")).toHaveText("Your email is confirmed.");
  expect(await status()).toBe("ACTIVE");
  await dispatch();
  await expect.poll(() => capture("/unsubscribe#")).toBeDefined();
  const unsubscribe = (await capture("/unsubscribe#"))?.match(
    /http:\/\/[^\s]+\/unsubscribe#[0-9a-f.]+/,
  )?.[0];
  expect(unsubscribe).toBeDefined();
  const code = new URL(unsubscribe!).hash.slice(1);
  const get = await request.get("/api/v1/waitlist/one-click/" + code, {
    maxRedirects: 0,
  });
  expect(get.status()).toBe(303);
  expect(await status()).toBe("ACTIVE");
  const leaf = await request.post("/api/v1/waitlist/one-click/" + code, {
    form: { "List-Unsubscribe": "One-Click" },
  });
  expect(leaf.status()).toBe(204);
  await page.goto(unsubscribe!);
  await page.getByRole("button", { name: "Unsubscribe" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "You have been unsubscribed.",
  );
  expect(await status()).toBe("UNSUBSCRIBED");
});
