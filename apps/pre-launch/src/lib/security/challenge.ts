import { z } from "zod";
import { HttpError, local, origin } from "@/lib/security/http";

const testSecret = "1x0000000000000000000000000000000AA";
const enrollmentKeys = [
  "LOOKUP_KEY",
  "ADDRESS_KEY",
  "RATE_KEY",
  "VERIFY_KEY",
  "UNSUBSCRIBE_KEY",
] as const;
const siteverifyResponse = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

export function waitlistConfiguration() {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (
    !siteKey ||
    !secret ||
    !process.env.DATABASE_URL?.trim() ||
    enrollmentKeys.some(
      (key) => !/^[a-f0-9]{64}$/i.test(process.env[key] ?? ""),
    ) ||
    (process.env.VERCEL === "1" && !process.env.APP_ORIGIN)
  )
    return;

  try {
    const hostname = new URL(origin()).hostname;
    const loopback = local();
    const hosted = process.env.VERCEL === "1" || !loopback;
    if (hosted && (loopback || secret === testSecret)) return;
    return { siteKey, secret, hostname, test: secret === testSecret };
  } catch {
    return;
  }
}

type Configuration = NonNullable<ReturnType<typeof waitlistConfiguration>>;

function unavailable(requestId: string, reason: string): never {
  console.error(
    JSON.stringify({ event: "turnstile_unavailable", requestId, reason }),
  );
  throw new HttpError(503, "unavailable");
}

export async function challenge(
  token: string,
  configuration: Configuration,
  requestId: string,
) {
  const body = new URLSearchParams({
    secret: configuration.secret,
    response: token,
    idempotency_key: requestId,
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    let reply: Response;
    try {
      reply = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body,
          signal: AbortSignal.timeout(6000),
          cache: "no-store",
        },
      );
    } catch {
      if (attempt === 0) continue;
      unavailable(requestId, "network");
    }
    if (!reply.ok) {
      if (attempt === 0 && reply.status >= 500) continue;
      unavailable(requestId, "provider_http");
    }

    const result = siteverifyResponse.safeParse(
      await reply.json().catch(() => null),
    );
    if (!result.success) unavailable(requestId, "provider_response");
    const data = result.data;
    const errors = data["error-codes"] ?? [];
    if (errors.includes("internal-error")) {
      if (attempt === 0) continue;
      unavailable(requestId, "provider_internal");
    }
    if (
      errors.includes("invalid-input-secret") ||
      errors.includes("missing-input-secret") ||
      errors.includes("bad-request")
    )
      unavailable(requestId, "provider_configuration");
    if (!data.success) {
      throw new HttpError(
        400,
        errors.length === 1 && errors[0] === "timeout-or-duplicate"
          ? "challenge_expired"
          : "challenge",
      );
    }
    const matches = configuration.test
      ? data.hostname === "example.com" && !data.action
      : data.hostname === configuration.hostname && data.action === "subscribe";
    if (!matches || errors.length) {
      console.warn(
        JSON.stringify({ event: "turnstile_context_rejected", requestId }),
      );
      throw new HttpError(400, "challenge");
    }
    return;
  }
  unavailable(requestId, "provider_internal");
}
