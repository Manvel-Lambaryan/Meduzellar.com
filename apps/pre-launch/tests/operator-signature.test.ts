import { generateKeyPairSync, sign } from "node:crypto";
import { expect, test } from "vitest";
import { freshFactor, signedOperatorClaims } from "@/lib/security/operator";
import { origin } from "@/lib/security/http";

test("Clerk verifies a synthetic signed token and rejects unauthorized, downgraded or expired claims", async () => {
  const issuer = "https://identity.example.test";
  const pair = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const publicKey = pair.publicKey
    .export({ type: "spki", format: "pem" })
    .toString();
  const now = Math.floor(Date.now() / 1000);
  const base = {
    sub: "fixture-subject",
    sid: "fixture-session",
    iss: issuer,
    azp: origin(),
    fva: [0, 2],
    iat: now,
    nbf: now - 10,
    exp: now + 60,
  };
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const jwt = (overrides: Partial<typeof base> = {}) => {
    const body =
      encode({
        alg: "RS256",
        typ: "JWT",
        cat: "cl_B7d4PD111AAA",
        kid: "fixture-key",
      }) +
      "." +
      encode({ ...base, ...overrides });
    return (
      body +
      "." +
      sign("sha256", Buffer.from(body), pair.privateKey).toString("base64url")
    );
  };
  const valid = await signedOperatorClaims(jwt(), issuer, publicKey);
  expect(valid.sub).toBe("fixture-subject");
  expect(freshFactor(valid.fva, valid.iat)).toBe(true);
  for (const token of [
    jwt({ azp: "https://other.example.test" }),
    jwt({ fva: [0, -1] }),
    jwt({ iss: "https://other.example.test" }),
    jwt({ exp: now - 60 }),
    jwt().replace(/\.[^.]+$/, ".bad-signature"),
  ])
    await expect(
      signedOperatorClaims(token, issuer, publicKey),
    ).rejects.toThrow();
});
