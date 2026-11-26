import { z } from "zod";
import { accepted, consentVersion } from "@/lib/content";
import { normalizeEmail } from "@/lib/security/crypto";
import { challenge } from "@/lib/security/challenge";
import {
  bytes,
  handle,
  HttpError,
  json,
  local,
  origin,
  output,
  rate,
  sameOrigin,
  source,
} from "@/lib/security/http";
import { subscribe, applyCredential } from "@/lib/waitlist/service";

const enrollment = z.strictObject({
  email: z.string().max(320),
  consent: z.literal(true),
  consentVersion: z.string().max(30),
  locale: z.string().max(16).optional(),
  challengeToken: z.string().min(1).max(2048),
});
const proof = z.strictObject({ token: z.string().length(97) });
export async function POST(
  req: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  return handle(async () => {
    sameOrigin(req);
    const { action } = await params;
    if (action === "subscribe") {
      const form =
        req.headers.get("content-type")?.split(";")[0] ===
        "application/x-www-form-urlencoded";
      let body: unknown;
      if (form) {
        const values = new URLSearchParams(await bytes(req));
        const keys = [...values.keys()];
        if (
          new Set(keys).size !== keys.length ||
          keys.some(
            (k) =>
              ![
                "email",
                "consent",
                "consentVersion",
                "cf-turnstile-response",
              ].includes(k),
          )
        )
          throw new HttpError(400, "invalid_input");
        body = {
          email: values.get("email"),
          consent: values.get("consent") === "on",
          consentVersion: values.get("consentVersion"),
          challengeToken: values.get("cf-turnstile-response"),
        };
      } else body = await json(req);
      const value = enrollment.parse(body);
      const email = normalizeEmail(value.email);
      if (
        !email ||
        (local() &&
          !email.endsWith(
            "@" + (process.env.LOCAL_TEST_MAIL_DOMAIN ?? "example.test"),
          ))
      )
        throw new HttpError(400, "invalid_input");
      if (value.consentVersion !== consentVersion)
        throw new HttpError(409, "policy_changed");
      await rate("subscribe-ip", source(req), 10, 600);
      await rate("subscribe-global", "all", 300, 600);
      await challenge(value.challengeToken);
      await subscribe(email);
      return form
        ? Response.redirect(origin() + "/waitlist-result", 303)
        : output({ message: accepted }, 202);
    }
    if (action === "verify" || action === "unsubscribe") {
      const { token } = proof.parse(await json(req));
      await rate(action, source(req), 45, 600);
      await applyCredential(
        token,
        action === "verify" ? "VERIFY" : "UNSUBSCRIBE",
      );
      return output({ ok: true });
    }
    throw new HttpError(404, "not_found");
  });
}
