import { afterEach, describe, expect, it, vi } from "vitest";
import { challenge, waitlistConfiguration } from "@/lib/security/challenge";

const configuration = {
  siteKey: "fixture-site-key",
  secret: "fixture-server-key",
  hostname: "meduzellar-com.vercel.app",
  test: false,
};
const requestId = "c0000000-0000-4000-8000-000000000001";
const accepted = {
  success: true,
  hostname: configuration.hostname,
  action: "subscribe",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Turnstile validation", () => {
  it("retries a provider outage with a single idempotency key", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockRejectedValueOnce(new Error("fixture transport failure"))
      .mockResolvedValueOnce(Response.json(accepted));
    vi.stubGlobal("fetch", fetch);
    await expect(
      challenge("fixture-token", configuration, requestId),
    ).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(2);
    for (const [, options] of fetch.mock.calls) {
      const body = options?.body as URLSearchParams;
      expect(body.get("response")).toBe("fixture-token");
      expect(body.get("idempotency_key")).toBe(requestId);
    }
  });

  it.each([
    [
      { success: false, "error-codes": ["timeout-or-duplicate"] },
      "challenge_expired",
    ],
    [
      { success: false, "error-codes": ["invalid-input-response"] },
      "challenge",
    ],
    [{ ...accepted, hostname: "other.example" }, "challenge"],
    [{ ...accepted, action: "other_action" }, "challenge"],
    [
      { success: false, "error-codes": ["invalid-input-secret"] },
      "unavailable",
    ],
  ])(
    "rejects provider response %# without retrying",
    async (response, code) => {
      const fetch = vi.fn().mockResolvedValue(Response.json(response));
      vi.stubGlobal("fetch", fetch);
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(console, "warn").mockImplementation(() => {});
      await expect(
        challenge("fixture-token", configuration, requestId),
      ).rejects.toMatchObject({
        code,
      });
      expect(fetch).toHaveBeenCalledTimes(1);
    },
  );

  it("does not enable enrollment on Vercel with missing or loopback configuration", () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("TURNSTILE_SITE_KEY", configuration.siteKey);
    vi.stubEnv("TURNSTILE_SECRET_KEY", configuration.secret);
    vi.stubEnv("DATABASE_URL", undefined);
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "fixture-blob-key");
    vi.stubEnv("RESEND_API_KEY", "fixture-mail-key");
    vi.stubEnv("WAITLIST_FROM_EMAIL", "Meduzellar <waitlist@example.test>");
    vi.stubEnv("RESEND_WEBHOOK_SECRET", "fixture-webhook-key");
    vi.stubEnv("CRON_SECRET", "a".repeat(64));
    for (const key of [
      "LOOKUP_KEY",
      "ADDRESS_KEY",
      "RATE_KEY",
      "VERIFY_KEY",
      "UNSUBSCRIBE_KEY",
    ])
      vi.stubEnv(key, "a".repeat(64));
    vi.stubEnv("APP_ORIGIN", undefined);
    expect(waitlistConfiguration()).toBeUndefined();
    vi.stubEnv("APP_ORIGIN", "http://127.0.0.1:3001");
    expect(waitlistConfiguration()).toBeUndefined();
    vi.stubEnv("APP_ORIGIN", "https://meduzellar-com.vercel.app");
    expect(waitlistConfiguration()).toEqual(configuration);
    vi.stubEnv("TURNSTILE_SECRET_KEY", undefined);
    expect(waitlistConfiguration()).toBeUndefined();
  });
});
