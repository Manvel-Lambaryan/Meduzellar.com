import { describe, expect, it } from "vitest";
import { normalizeEmail, same } from "@/lib/security/crypto";
import { freshFactor } from "@/lib/security/operator";
import { bytes, sameOrigin } from "@/lib/security/http";

describe("request controls", () => {
  it("normalizes only the domain and rejects unsafe address forms", () => {
    expect(normalizeEmail("  User+tag@bücher.example  ")).toBe(
      "User+tag@xn--bcher-kva.example",
    );
    for (const address of [
      "bad..one@site.test",
      "héllo@site.test",
      "a@site.test/path",
      "a@site.test:443",
      "a@-site.test",
      "a@site.t",
      "a@site.test#path",
    ])
      expect(normalizeEmail(address)).toBeNull();
  });
  it("uses a bounded freshness window and declines missing or downgraded evidence", () => {
    const now = 1_800_000_000_000;
    expect(freshFactor([0, 9], now / 1000 - 59, now)).toBe(true);
    for (const factor of [
      undefined,
      [],
      [0, -1],
      ["0", 0],
      [0, 10.5],
      [0, 10],
      [0, 9, 0],
    ])
      expect(freshFactor(factor, now / 1000 - 61, now)).toBe(false);
    expect(same("valid", "vàlid")).toBe(false);
  });
  it("caps the actual streamed read and refuses other origins", async () => {
    await expect(
      bytes(
        new Request("http://local.test", {
          method: "POST",
          body: "x".repeat(4100),
        }),
      ),
    ).rejects.toMatchObject({ status: 400 });
    expect(() =>
      sameOrigin(
        new Request("http://127.0.0.1:3001", {
          headers: { origin: "https://other.test" },
        }),
      ),
    ).toThrow();
  });
});
