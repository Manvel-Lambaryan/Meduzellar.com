import { test, expect } from "@playwright/test";
import { Client } from "pg";
import { randomUUID } from "node:crypto";
import { loadEnvFile } from "node:process";
import { lookup, unseal } from "../../src/lib/security/crypto";

test("official Turnstile test keys and real email verification, opt-out, and worker capture", async ({
  page,
  request,
}) => {
  test.setTimeout(75_000);
  loadEnvFile(".env.local");
  const database = new URL(process.env.DATABASE_URL ?? "");
  expect(database.hostname).toBe("127.0.0.1");
  expect(database.pathname).toBe("/prelaunch");
  const client = new Client({
    connectionString: database.href,
    connectionTimeoutMillis: 3000,
  });
  await client.connect();
  const address = "Browser-" + randomUUID() + "@example.test";
  const identity = lookup(address);
  const dispatch = async () => {
    const result = await request.get("/api/v1/internal/cron/delivery", {
      headers: { Authorization: "Bearer " + process.env.CRON_SECRET },
    });
    expect(result.status()).toBe(204);
  };
  const capture = async (kind: string) => {
    const { rows } = await client.query(
      'SELECT m."sealed",m."deliveryId" FROM "CapturedMail" m JOIN "Delivery" d ON d."id"=m."deliveryId" JOIN "Subscriber" s ON s."id"=d."subscriberId" WHERE s."lookup"=$1 AND d."kind"=$2',
      [identity, kind],
    );
    expect(rows).toHaveLength(1);
    return JSON.parse(unseal(rows[0].sealed, "mail:" + rows[0].deliveryId))
      .text as string;
  };
  const status = async () => {
    const { rows } = await client.query(
      'SELECT "status" FROM "Subscriber" WHERE "lookup"=$1',
      [identity],
    );
    return rows[0]?.status;
  };
  try {
    await page.goto("/");
    await expect(
      page.locator('input[name="cf-turnstile-response"]'),
    ).toHaveValue(/.+/, { timeout: 30_000 });
    await page.getByRole("textbox", { name: "Email address" }).fill(address);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Notify Me" }).click();
    await expect(page.getByRole("status")).toContainText(
      "a confirmation email will arrive shortly",
      { timeout: 15_000 },
    );
    expect(await status()).toBe("PENDING");
    await dispatch();
    const verify = (await capture("VERIFY")).match(
      /http:\/\/[^\s]+\/verify#[0-9a-f.]+/,
    )?.[0];
    expect(verify).toBeDefined();
    await page.goto(verify!);
    await expect(page.getByLabel("Confirmation code")).toHaveValue(
      /^[a-f0-9.]{97}$/,
    );
    expect(await status()).toBe("PENDING");
    await page.getByRole("button", { name: "Confirm email" }).click();
    await expect(page.getByRole("status")).toHaveText(
      "Your email is confirmed.",
    );
    expect(await status()).toBe("ACTIVE");
    await dispatch();
    const unsubscribe = (await capture("CONFIRM")).match(
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
  } finally {
    await client.end();
  }
});
