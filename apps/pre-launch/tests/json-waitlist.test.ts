import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { credential, lookup } from "@/lib/security/crypto";
import {
  authorizeMail,
  claimMail,
  enroll,
  finishMail,
  suppressWaitlistAddresses,
  useWaitlistToken,
  waitlistRate,
} from "@/lib/waitlist/json-service";

let directory: string;
const address = "signup@example.test";
const file = () => join(directory, "waitlist.json");
const snapshot = async () => JSON.parse(await readFile(file(), "utf8"));

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "meduzellar-json-test-"));
  vi.stubEnv("WAITLIST_LOCAL_DIRECTORY", directory);
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", undefined);
  vi.stubEnv("VERCEL", undefined);
  vi.stubEnv("APP_ORIGIN", "http://127.0.0.1:3001");
  vi.stubEnv("DATABASE_URL", undefined);
});
afterEach(() => vi.unstubAllEnvs());

describe("authoritative private waitlist document", () => {
  it("serializes concurrent independent and duplicate writes, encrypted", async () => {
    await Promise.all([
      enroll(address),
      enroll(address),
      enroll("other@example.test"),
    ]);
    const saved = await snapshot();
    expect(Object.keys(saved.subscribers)).toHaveLength(2);
    expect(Object.keys(saved.outbox)).toHaveLength(2);
    expect(saved.subscribers[lookup(address)].consent[0]).toMatchObject({
      kind: "GRANTED",
      version: expect.any(String),
      at: expect.any(Number),
    });
    expect(await readFile(file(), "utf8")).not.toContain(address);
    vi.resetModules();
    const fresh = await import("@/lib/waitlist/json-service");
    await fresh.enroll("later@example.test");
    expect(Object.keys((await snapshot()).subscribers)).toHaveLength(3);
  });

  it("preserves malformed state and recovers after restoring a valid copy", async () => {
    await enroll(address);
    const previous = await readFile(file(), "utf8");
    await writeFile(file(), "{truncated");
    await expect(enroll("other@example.test")).rejects.toThrow();
    expect(await readFile(file(), "utf8")).toBe("{truncated");
    await writeFile(file(), previous);
    await enroll("other@example.test");
    expect(Object.keys((await snapshot()).subscribers)).toHaveLength(2);
  });

  it("fails closed on storage failures and retryable write contention", async () => {
    await writeFile(file() + ".lock", "");
    await expect(enroll(address)).rejects.toThrow(
      "Waitlist storage unavailable",
    );
    await expect(readFile(file())).rejects.toMatchObject({ code: "ENOENT" });
    vi.stubEnv("WAITLIST_LOCAL_DIRECTORY", file() + ".lock");
    await expect(enroll(address)).rejects.toThrow();
  });

  it("consumes proof once, preserves consent, and revokes queued delivery", async () => {
    await enroll(address);
    const pending = await claimMail();
    expect(pending).toBeDefined();
    expect(await authorizeMail(pending!.id, pending!.lease)).toBeDefined();
    await finishMail(pending!.id, pending!.lease, true);
    const verify = credential("VERIFY", pending!.id, 1);
    await expect(useWaitlistToken(verify, "UNSUBSCRIBE")).rejects.toMatchObject(
      { code: "invalid_token" },
    );
    await Promise.all([
      useWaitlistToken(verify, "VERIFY"),
      useWaitlistToken(verify, "VERIFY"),
    ]);
    const active = await snapshot();
    expect(active.subscribers[lookup(address)].state).toBe("ACTIVE");
    expect(Object.keys(active.outbox)).toHaveLength(1);
    const unsubscribe = credential(
      "UNSUBSCRIBE",
      Object.keys(active.outbox)[0],
      1,
    );
    const queued = await claimMail();
    await useWaitlistToken(unsubscribe, "UNSUBSCRIBE");
    await useWaitlistToken(unsubscribe, "UNSUBSCRIBE");
    expect(await authorizeMail(queued!.id, queued!.lease)).toBeUndefined();
    const revoked = await snapshot();
    expect(
      revoked.subscribers[lookup(address)].consent.map(
        ({ kind }: { kind: string }) => kind,
      ),
    ).toEqual(["GRANTED", "VERIFIED", "REVOKED"]);
    expect(revoked.outbox).toEqual({});
  });

  it("blocks sending and re-enrollment after signed-provider suppression is recorded", async () => {
    await enroll(address);
    await suppressWaitlistAddresses([address]);
    await enroll(address);
    expect(await claimMail()).toBeUndefined();
    expect((await snapshot()).suppression[lookup(address)]).toEqual(
      expect.any(Number),
    );
  });

  it("persists rate counters across a fresh module and concurrent requests", async () => {
    const results = await Promise.allSettled(
      Array.from({ length: 3 }, () =>
        waitlistRate("signup", "synthetic", 2, 3600),
      ),
    );
    expect(results.filter(({ status }) => status === "fulfilled")).toHaveLength(
      2,
    );
    vi.resetModules();
    const fresh = await import("@/lib/waitlist/json-service");
    await expect(
      fresh.waitlistRate("signup", "synthetic", 2, 3600),
    ).rejects.toMatchObject({ status: 429, code: "rate_limited" });
    expect(
      await readFile(join(directory, "waitlist-limits.json"), "utf8"),
    ).not.toContain("synthetic");
  });
});
